import time
from pathlib import Path
import torch
from torch import nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader, WeightedRandomSampler
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent
DATASET_DIR = AI_DIR / "dataset" / "split_drinking_water"
MODEL_DIR = AI_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DEVICE = torch.device("cpu")
BATCH_SIZE = 32
WARMUP_EPOCHS = 2
FINETUNE_EPOCHS = 6
TOTAL_EPOCHS = WARMUP_EPOCHS + FINETUNE_EPOCHS

weights = MobileNet_V3_Large_Weights.DEFAULT
val_transform = weights.transforms()

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.75, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=12),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def train_drinking_water_classifier():
    print("=" * 60, flush=True)
    print("Balanced Re-Training: Drinking Water Facility Classifier", flush=True)
    print(f"Data directory: {DATASET_DIR}", flush=True)
    print(f"Device: {DEVICE}", flush=True)
    print(f"Balanced Sampler Active | Warmup: {WARMUP_EPOCHS} eps | Finetune: {FINETUNE_EPOCHS} eps | Batch: {BATCH_SIZE}", flush=True)
    print("=" * 60, flush=True)

    train_dir = DATASET_DIR / "train"
    val_dir = DATASET_DIR / "val"
    test_dir = DATASET_DIR / "test"

    train_dataset = ImageFolder(root=train_dir, transform=train_transform)
    val_dataset = ImageFolder(root=val_dir, transform=val_transform)
    test_dataset = ImageFolder(root=test_dir, transform=val_transform)

    class_names = train_dataset.classes
    print(f"Classes ({len(class_names)}): {class_names}", flush=True)
    print(f"Train samples: {len(train_dataset)}, Val: {len(val_dataset)}, Test: {len(test_dataset)}", flush=True)

    # Balanced WeightedRandomSampler to prevent functional_drinking_water from dominating
    class_counts = torch.bincount(torch.tensor(train_dataset.targets), minlength=len(class_names)).float()
    class_sample_weights = 1.0 / torch.pow(class_counts, 0.75)
    sample_weights = class_sample_weights[train_dataset.targets]
    sampler = WeightedRandomSampler(weights=sample_weights, num_samples=len(train_dataset), replacement=True)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, sampler=sampler, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    model = mobilenet_v3_large(weights=weights)

    # Classifier head setup
    in_features = model.classifier[3].in_features
    model.classifier[2] = nn.Dropout(p=0.25)
    model.classifier[3] = nn.Linear(in_features, len(class_names))

    # Phase 1: Warmup classifier head
    for param in model.features.parameters():
        param.requires_grad = False
    for param in model.classifier.parameters():
        param.requires_grad = True

    model = model.to(DEVICE)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.08)
    optimizer = AdamW(model.classifier.parameters(), lr=8e-4, weight_decay=1e-4)

    best_val_acc = 0.0
    checkpoint_path = MODEL_DIR / "mobilenetv3_drinking_water.pth"
    start_time = time.time()

    print("\n--- Phase 1: Classifier Warmup ---", flush=True)
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
        print(f"Warmup Epoch [{epoch}/{WARMUP_EPOCHS}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Acc: {val_acc*100:.2f}%", flush=True)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "validation_accuracy": val_acc,
                "epoch": epoch,
            }, checkpoint_path)

    print("\n--- Phase 2: Feature Fine-Tuning (Blocks 11-16) ---", flush=True)
    for i in range(11, len(model.features)):
        for param in model.features[i].parameters():
            param.requires_grad = True

    backbone_params = [p for p in model.features.parameters() if p.requires_grad]
    classifier_params = [p for p in model.classifier.parameters() if p.requires_grad]

    optimizer = AdamW([
        {"params": backbone_params, "lr": 4e-5, "weight_decay": 1e-4},
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
        print(f"Finetune Epoch [{epoch:02d}/{FINETUNE_EPOCHS:02d}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Acc: {val_acc*100:.2f}%", flush=True)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "validation_accuracy": val_acc,
                "epoch": WARMUP_EPOCHS + epoch,
            }, checkpoint_path)
            print(f"  ✓ Saved new best model checkpoint (Val Acc: {val_acc*100:.2f}%) to {checkpoint_path.name}", flush=True)

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
    print(f"\nFinal Test Evaluation for Drinking Water: {test_acc*100:.2f}% Accuracy ({t_correct}/{t_total})", flush=True)
    print(f"Best Validation Accuracy achieved: {best_val_acc*100:.2f}%", flush=True)
    print(f"Total training time: {time.time() - start_time:.1f}s", flush=True)
    print(f"Model saved at: {checkpoint_path}", flush=True)


if __name__ == "__main__":
    train_drinking_water_classifier()
