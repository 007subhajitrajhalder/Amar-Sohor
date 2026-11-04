
from pathlib import Path

import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)


# 1. Define paths and the CPU device.
SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_v2"
CHECKPOINT_PATH = (
    SCRIPT_DIR.parent / "models" / "mobilenetv3_amar_sohor.pth"
)

DEVICE = torch.device("cpu")
BATCH_SIZE = 8


# 2. Load the test dataset using the model's preprocessing.
weights = MobileNet_V3_Large_Weights.DEFAULT

test_dataset = ImageFolder(
    root=DATASET_DIR / "test",
    transform=weights.transforms(),
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)


# 3. Load the saved checkpoint.
checkpoint = torch.load(
    CHECKPOINT_PATH,
    map_location=DEVICE,
    weights_only=True,
)

class_names = checkpoint["class_names"]

assert test_dataset.classes == class_names


# 4. Re-create the four-class model architecture.
model = mobilenet_v3_large(weights=None)

input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(input_features, len(class_names))

model.load_state_dict(checkpoint["model_state_dict"])
model = model.to(DEVICE)
model.eval()


# 5. Predict the classes of all test images.
all_labels = []
all_predictions = []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(DEVICE)

        outputs = model(images)
        predictions = outputs.argmax(dim=1)

        all_labels.extend(labels.tolist())
        all_predictions.extend(predictions.tolist())


# 6. Calculate overall accuracy.
accuracy = accuracy_score(all_labels, all_predictions)

print("Saved checkpoint epoch:", checkpoint["epoch"])
print(
    "Best validation accuracy: "
    f"{checkpoint['validation_accuracy']:.2%}"
)
print("Number of test images:", len(test_dataset))
print(f"Test accuracy: {accuracy:.2%}")


# 7. Print precision, recall, and F1-score for each class.
print("\nClassification report:")

print(
    classification_report(
        all_labels,
        all_predictions,
        labels=list(range(len(class_names))),
        target_names=class_names,
        digits=3,
        zero_division=0,
    )
)


# 8. Print the confusion matrix.
matrix = confusion_matrix(
    all_labels,
    all_predictions,
    labels=list(range(len(class_names))),
)

print("Confusion matrix:")
print("Rows = actual classes; columns = predicted classes")
print("Class order:", class_names)
print(matrix)
