from pathlib import Path
import time
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
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_toilets"
MODEL_DIR = SCRIPT_DIR.parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DEVICE = torch.device("cpu")
BATCH_SIZE = 16
EPOCHS = 8
BACKBONE_LR = 0.00005
CLASSIFIER_LR = 0.0005

CLASS_NAMES = [
    "broken_public_toilet",
    "broken_public_urinal",
    "clean_public_toilet",
    "clean_public_urinal",
    "dirty_public_toilet",
    "dirty_public_urinal",
    "irrelevant_image",
]

weights = MobileNet_V3_Large_Weights.DEFAULT
val_transform = weights.transforms()

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

train_dataset = ImageFolder(root=DATASET_DIR / "train", transform=train_transform)
validation_dataset = ImageFolder(root=DATASET_DIR / "val", transform=val_transform)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
validation_loader = DataLoader(validation_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

model = mobilenet_v3_large(weights=weights)

for param in model.parameters():
    param.requires_grad = False

# Unfreeze blocks 11 to 16
for i in range(11, len(model.features)):
    for param in model.features[i].parameters():
        param.requires_grad = True

input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(input_features, len(CLASS_NAMES))

for param in model.classifier.parameters():
    param.requires_grad = True

model = model.to(DEVICE)

class_counts = torch.bincount(torch.tensor(train_dataset.targets), minlength=len(CLASS_NAMES)).float()
raw_inv = len(train_dataset) / (len(CLASS_NAMES) * class_counts)
smooth_weights = torch.sqrt(raw_inv)
smooth_weights = (smooth_weights / smooth_weights.mean()).to(DEVICE)

# Label smoothing prevents overconfidence on noisy boundary cases (e.g. wet floor vs dirty)
criterion = nn.CrossEntropyLoss(weight=smooth_weights, label_smoothing=0.1)

backbone_params = [p for p in model.features.parameters() if p.requires_grad]
classifier_params = [p for p in model.classifier.parameters() if p.requires_grad]

optimizer = AdamW([
    {"params": backbone_params, "lr": BACKBONE_LR, "weight_decay": 1e-4},
    {"params": classifier_params, "lr": CLASSIFIER_LR, "weight_decay": 1e-4},
])

scheduler = CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

best_validation_accuracy = 0.0
checkpoint_path = MODEL_DIR / "mobilenetv3_toilets.pth"

start_time = time.time()
print(f"Starting regularized fine-tuning (AdamW + Label Smoothing + Blocks 11-16)...")

for epoch in range(EPOCHS):
    epoch_start = time.time()
    model.train()

    total_train_loss = 0.0
    train_correct = 0
    train_total = 0

    for images, labels in train_loader:
        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_train_loss += loss.item() * images.size(0)
        predictions = outputs.argmax(dim=1)
        train_correct += (predictions == labels).sum().item()
        train_total += labels.size(0)

    scheduler.step()

    train_loss = total_train_loss / train_total
    train_accuracy = train_correct / train_total

    model.eval()
    total_validation_loss = 0.0
    validation_correct = 0
    validation_total = 0

    with torch.no_grad():
        for images, labels in validation_loader:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)
            loss = criterion(outputs, labels)

            total_validation_loss += loss.item() * images.size(0)
            predictions = outputs.argmax(dim=1)
            validation_correct += (predictions == labels).sum().item()
            validation_total += labels.size(0)

    validation_loss = total_validation_loss / validation_total
    validation_accuracy = validation_correct / validation_total
    epoch_duration = time.time() - epoch_start

    current_lr = scheduler.get_last_lr()
    print(f"\nEpoch {epoch + 1}/{EPOCHS} ({epoch_duration:.1f}s) | LR: [backbone={current_lr[0]:.6f}, head={current_lr[1]:.6f}]")
    print(f"  Train Loss: {train_loss:.4f} | Train Acc: {train_accuracy:.2%}")
    print(f"  Val Loss  : {validation_loss:.4f} | Val Acc  : {validation_accuracy:.2%}")

    if validation_accuracy > best_validation_accuracy:
        best_validation_accuracy = validation_accuracy
        torch.save(
            {
                "model_state_dict": model.state_dict(),
                "class_names": train_dataset.classes,
                "class_to_idx": train_dataset.class_to_idx,
                "epoch": epoch + 1,
                "validation_accuracy": validation_accuracy,
            },
            checkpoint_path,
        )
        print(f"  --> Saved new best checkpoint with {validation_accuracy:.2%} validation accuracy!")

total_duration = time.time() - start_time
print(f"\nTraining completed in {total_duration / 60:.1f} minutes.")
print(f"Best validation accuracy: {best_validation_accuracy:.2%}")
