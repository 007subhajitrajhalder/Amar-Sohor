
from pathlib import Path

import torch
from torch import nn
from torch.optim import Adam
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)


# --------------------------------------------------
# 1. Configuration
# --------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_v2"
MODEL_DIR = SCRIPT_DIR.parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DEVICE = torch.device("cpu")
BATCH_SIZE = 8
EPOCHS = 5
LEARNING_RATE = 0.001

CLASS_NAMES = [
    "broken_bin",
    "irrelevant_image",
    "normal_bin",
    "overflowing_dustbin",
]


# --------------------------------------------------
# 2. Load the pretrained model's image transforms
# --------------------------------------------------

weights = MobileNet_V3_Large_Weights.DEFAULT
image_transform = weights.transforms()


# --------------------------------------------------
# 3. Load the datasets
# --------------------------------------------------

train_dataset = ImageFolder(
    root=DATASET_DIR / "train",
    transform=image_transform,
)

validation_dataset = ImageFolder(
    root=DATASET_DIR / "validation",
    transform=image_transform,
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
# 4. Create the four-class model
# --------------------------------------------------

model = mobilenet_v3_large(weights=weights)

for parameter in model.parameters():
    parameter.requires_grad = False

input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(input_features, len(CLASS_NAMES))

for parameter in model.classifier[3].parameters():
    parameter.requires_grad = True

model = model.to(DEVICE)


# --------------------------------------------------
# 5. Calculate class weights
# --------------------------------------------------

class_counts = torch.bincount(
    torch.tensor(train_dataset.targets),
    minlength=len(CLASS_NAMES),
).float()

class_weights = len(train_dataset) / (
    len(CLASS_NAMES) * class_counts
)

class_weights = class_weights.to(DEVICE)

print("Class mapping:", train_dataset.class_to_idx)
print("Training class counts:", class_counts.tolist())
print("Class loss weights:", class_weights.tolist())


# --------------------------------------------------
# 6. Define loss function and optimizer
# --------------------------------------------------

criterion = nn.CrossEntropyLoss(weight=class_weights)

optimizer = Adam(
    model.classifier[3].parameters(),
    lr=LEARNING_RATE,
)


# --------------------------------------------------
# 7. Train and validate
# --------------------------------------------------

best_validation_accuracy = 0.0

for epoch in range(EPOCHS):
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

    print(f"\nEpoch {epoch + 1}/{EPOCHS}")
    print(f"Training loss: {train_loss:.4f}")
    print(f"Training accuracy: {train_accuracy:.2%}")
    print(f"Validation loss: {validation_loss:.4f}")
    print(f"Validation accuracy: {validation_accuracy:.2%}")

    if validation_accuracy > best_validation_accuracy:
        best_validation_accuracy = validation_accuracy

        checkpoint_path = MODEL_DIR / "mobilenetv3_amar_sohor.pth"

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

        print("Best model checkpoint saved:", checkpoint_path)


print("\nTraining finished.")
print(f"Best validation accuracy: {best_validation_accuracy:.2%}")
