import time
from pathlib import Path
import torch
from torch import nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent
DATASET_DIR = AI_DIR / "dataset" / "split_parking"
MODEL_DIR = AI_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DEVICE = torch.device("cpu")
BATCH_SIZE = 16
WARMUP_EPOCHS = 3
FINETUNE_EPOCHS = 10
TOTAL_EPOCHS = WARMUP_EPOCHS + FINETUNE_EPOCHS

weights = MobileNet_V3_Large_Weights.DEFAULT
val_transform = weights.transforms()

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    transforms.RandomErasing(p=0.2, scale=(0.02, 0.2)),
])


def train_parking_classifier():
    print("=" * 60)
    print("Enhanced Training: Public Parking Facility Classifier")
    print(f"Data directory: {DATASET_DIR}")
    print(f"Device: {DEVICE}")
    print(f"Warmup: {WARMUP_EPOCHS} eps | Finetune: {FINETUNE_EPOCHS} eps | Batch: {BATCH_SIZE}")
    print("=" * 60)

    train_dir = DATASET_DIR / "train"
    val_dir = DATASET_DIR / "val"
    test_dir = DATASET_DIR / "test"

    train_dataset = ImageFolder(root=train_dir, transform=train_transform)
    val_dataset = ImageFolder(root=val_dir, transform=val_transform)
    test_dataset = ImageFolder(root=test_dir, transform=val_transform)

    class_names = train_dataset.classes
    print(f"Classes ({len(class_names)}): {class_names}")
    print(f"Train samples: {len(train_dataset)}, Val: {len(val_dataset)}, Test: {len(test_dataset)}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    model = mobilenet_v3_large(weights=weights)

    # 1. Setup classifier head
    in_features = model.classifier[3].in_features
    model.classifier[2] = nn.Dropout(p=0.3)
    model.classifier[3] = nn.Linear(in_features, len(class_names))

    # Stage 1: Freeze entire backbone, train ONLY head
    for param in model.features.parameters():
        param.requires_grad = False
    for param in model.classifier.parameters():
        param.requires_grad = True

    model = model.to(DEVICE)

    # Class weighting with power factor to balance small classes without overshooting
    class_counts = torch.bincount(torch.tensor(train_dataset.targets), minlength=len(class_names)).float()
    raw_inv = len(train_dataset) / (len(class_names) * class_counts)
    class_weights = torch.pow(raw_inv, 0.65)
    class_weights = (class_weights / class_weights.mean()).to(DEVICE)

    criterion = nn.CrossEntropyLoss(weight=class_weights, label_smoothing=0.08)

    optimizer = AdamW(model.classifier.parameters(), lr=1e-3, weight_decay=1e-4)

    best_val_acc = 0.0
    checkpoint_path = MODEL_DIR / "mobilenetv3_parking.pth"
    start_time = time.time()

    print("\n--- Phase 1: Classifier Head Warmup ---")
    for epoch in range(1, WARMUP_EPOCHS + 1):
        epoch_start = time.time()
        model.train()
        total_loss, correct, total = 0.0, 0, 0

        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_loss = total_loss / total
        train_acc = correct / total

        # Validation
        model.eval()
        v_loss, v_correct, v_total = 0.0, 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)
                v_loss += loss.item() * images.size(0)
                preds = outputs.argmax(dim=1)
                v_correct += (preds == labels).sum().item()
                v_total += labels.size(0)

        val_loss = v_loss / v_total
        val_acc = v_correct / v_total
        duration = time.time() - epoch_start
        print(f"Warmup Epoch [{epoch}/{WARMUP_EPOCHS}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Acc: {val_acc*100:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "validation_accuracy": val_acc,
                "epoch": epoch,
            }, checkpoint_path)

    print("\n--- Phase 2: Deep Feature Fine-Tuning (Blocks 7-16) ---")
    # Unfreeze blocks 7 to 16 for richer domain adaptation
    for i in range(7, len(model.features)):
        for param in model.features[i].parameters():
            param.requires_grad = True

    backbone_params = [p for p in model.features.parameters() if p.requires_grad]
    classifier_params = [p for p in model.classifier.parameters() if p.requires_grad]

    optimizer = AdamW([
        {"params": backbone_params, "lr": 3e-5, "weight_decay": 1e-4},
        {"params": classifier_params, "lr": 3e-4, "weight_decay": 1e-4},
    ])
    scheduler = CosineAnnealingLR(optimizer, T_max=FINETUNE_EPOCHS, eta_min=1e-6)

    for epoch in range(1, FINETUNE_EPOCHS + 1):
        epoch_start = time.time()
        model.train()
        total_loss, correct, total = 0.0, 0, 0

        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        scheduler.step()
        train_loss = total_loss / total
        train_acc = correct / total

        # Validation
        model.eval()
        v_loss, v_correct, v_total = 0.0, 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)
                v_loss += loss.item() * images.size(0)
                preds = outputs.argmax(dim=1)
                v_correct += (preds == labels).sum().item()
                v_total += labels.size(0)

        val_loss = v_loss / v_total
        val_acc = v_correct / v_total
        duration = time.time() - epoch_start
        print(f"Finetune Epoch [{epoch:02d}/{FINETUNE_EPOCHS:02d}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Acc: {val_acc*100:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "validation_accuracy": val_acc,
                "epoch": WARMUP_EPOCHS + epoch,
            }, checkpoint_path)
            print(f"  ✓ Saved new best model checkpoint (Val Acc: {val_acc*100:.2f}%) to {checkpoint_path.name}")

    # Evaluate on unseen test set
    best_checkpoint = torch.load(checkpoint_path, map_location=DEVICE, weights_only=True)
    model.load_state_dict(best_checkpoint["model_state_dict"])
    model.eval()

    t_correct, t_total = 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            outputs = model(images)
            preds = outputs.argmax(dim=1)
            t_correct += (preds == labels).sum().item()
            t_total += labels.size(0)

    test_acc = t_correct / t_total
    print(f"\nFinal Test Evaluation for Public Parking: {test_acc*100:.2f}% Accuracy ({t_correct}/{t_total})")
    print(f"Best Validation Accuracy achieved: {best_val_acc*100:.2f}%")
    print(f"Total training time: {time.time() - start_time:.1f}s")
    print(f"Model saved at: {checkpoint_path}")


if __name__ == "__main__":
    train_parking_classifier()
