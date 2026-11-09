from pathlib import Path
import time
import math
import torch
from torch import nn
from torch.optim import Adam
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

# --------------------------------------------------
# 1. Configuration
# --------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_toilets"
MODEL_DIR = SCRIPT_DIR.parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DEVICE = torch.device("cpu")
BATCH_SIZE = 16
EPOCHS = 8
BACKBONE_LR = 0.0001
CLASSIFIER_LR = 0.001

CLASS_NAMES = [
    "broken_public_toilet",
    "broken_public_urinal",
    "clean_public_toilet",
    "clean_public_urinal",
    "dirty_public_toilet",
    "dirty_public_urinal",
    "irrelevant_image",
]

# --------------------------------------------------
# 2. Image Transforms (Augmentation for train, standard for val)
# --------------------------------------------------

weights = MobileNet_V3_Large_Weights.DEFAULT
val_transform = weights.transforms()

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.85, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# --------------------------------------------------
# 3. Load Datasets
# --------------------------------------------------

train_dataset = ImageFolder(
    root=DATASET_DIR / "train",
    transform=train_transform,
)

validation_dataset = ImageFolder(
    root=DATASET_DIR / "val",
    transform=val_transform,
)

assert train_dataset.classes == CLASS_NAMES
assert validation_dataset.classes == CLASS_NAMES

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0,
)

validation_loader = DataLoader(
    validation_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)

# --------------------------------------------------
# 4. Model Architecture & Selective Unfreezing
# --------------------------------------------------

model = mobilenet_v3_large(weights=weights)

# Freeze all lower feature blocks (0 to 12)
for parameter in model.parameters():
    parameter.requires_grad = False

# Unfreeze top feature blocks (13 to 16)
for i in range(13, len(model.features)):
    for parameter in model.features[i].parameters():
        parameter.requires_grad = True

# Replace the final classification projection
input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(input_features, len(CLASS_NAMES))

# Unfreeze the entire classifier (projection + linear head)
for parameter in model.classifier.parameters():
    parameter.requires_grad = True

model = model.to(DEVICE)

# Count trainable parameters
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total parameters: {total_params:,}")
print(f"Trainable parameters: {trainable_params:,} ({trainable_params / total_params:.1%})")

# --------------------------------------------------
# 5. Smoothed Class Weights
# --------------------------------------------------

class_counts = torch.bincount(
    torch.tensor(train_dataset.targets),
    minlength=len(CLASS_NAMES),
).float()

# Square-root smoothed inverse frequency to balance without exploding gradients
raw_inv = len(train_dataset) / (len(CLASS_NAMES) * class_counts)
smooth_weights = torch.sqrt(raw_inv)
# Normalize to have mean = 1.0
smooth_weights = smooth_weights / smooth_weights.mean()
smooth_weights = smooth_weights.to(DEVICE)

print("Class mapping:", train_dataset.class_to_idx)
print("Training class counts:", class_counts.tolist())
print("Smoothed class loss weights:", [round(w.item(), 3) for w in smooth_weights])

# --------------------------------------------------
# 6. Loss, Differential Optimizer & Scheduler
# --------------------------------------------------

criterion = nn.CrossEntropyLoss(weight=smooth_weights)

backbone_params = [p for p in model.features.parameters() if p.requires_grad]
classifier_params = [p for p in model.classifier.parameters() if p.requires_grad]

optimizer = Adam([
    {"params": backbone_params, "lr": BACKBONE_LR},
    {"params": classifier_params, "lr": CLASSIFIER_LR},
])

scheduler = CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

# --------------------------------------------------
# 7. Training & Validation Loop
# --------------------------------------------------

best_validation_accuracy = 0.0
checkpoint_path = MODEL_DIR / "mobilenetv3_toilets.pth"

start_time = time.time()
print(f"\nStarting fine-tuning for {EPOCHS} epochs (batch_size={BATCH_SIZE})...")

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
print(f"\nFine-tuning completed in {total_duration / 60:.1f} minutes.")
print(f"Best validation accuracy: {best_validation_accuracy:.2%}")
