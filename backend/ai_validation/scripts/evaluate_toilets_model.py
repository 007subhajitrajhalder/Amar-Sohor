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

# --------------------------------------------------
# 1. Define paths and CPU device
# --------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_toilets"
CHECKPOINT_PATH = SCRIPT_DIR.parent / "models" / "mobilenetv3_toilets.pth"
REPORT_DIR = SCRIPT_DIR.parent / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
REPORT_PATH = REPORT_DIR / "evaluation_toilets.txt"

DEVICE = torch.device("cpu")
BATCH_SIZE = 8

# --------------------------------------------------
# 2. Load the test dataset
# --------------------------------------------------

weights = MobileNet_V3_Large_Weights.DEFAULT
image_transform = weights.transforms()

test_dataset = ImageFolder(
    root=DATASET_DIR / "test",
    transform=image_transform,
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)

# --------------------------------------------------
# 3. Load the saved checkpoint
# --------------------------------------------------

checkpoint = torch.load(
    CHECKPOINT_PATH,
    map_location=DEVICE,
    weights_only=True,
)

class_names = checkpoint["class_names"]
assert test_dataset.classes == class_names, (
    f"Dataset class order does not match model class order! {test_dataset.classes} vs {class_names}"
)

# --------------------------------------------------
# 4. Re-create the model architecture
# --------------------------------------------------

model = mobilenet_v3_large(weights=None)
input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(input_features, len(class_names))
model.load_state_dict(checkpoint["model_state_dict"])
model = model.to(DEVICE)
model.eval()

# --------------------------------------------------
# 5. Predict all test images
# --------------------------------------------------

all_labels = []
all_predictions = []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(DEVICE)
        outputs = model(images)
        predictions = outputs.argmax(dim=1)
        all_labels.extend(labels.tolist())
        all_predictions.extend(predictions.tolist())

# --------------------------------------------------
# 6. Calculate evaluation metrics
# --------------------------------------------------

accuracy = accuracy_score(all_labels, all_predictions)
correct_predictions = sum(a == p for a, p in zip(all_labels, all_predictions))
incorrect_predictions = len(test_dataset) - correct_predictions

report = classification_report(
    all_labels,
    all_predictions,
    labels=list(range(len(class_names))),
    target_names=class_names,
    digits=3,
    zero_division=0,
)

matrix = confusion_matrix(
    all_labels,
    all_predictions,
    labels=list(range(len(class_names))),
)

# --------------------------------------------------
# 7. Print and save results
# --------------------------------------------------

header = "=" * 60
summary_lines = [
    header,
    " Amar Sohor - Toilet & Urinal AI Classifier Evaluation",
    header,
    f"Model checkpoint: {CHECKPOINT_PATH.name}",
    f"Best validation accuracy during training: {checkpoint['validation_accuracy']:.2%} (Epoch {checkpoint['epoch']})",
    f"Total test samples: {len(test_dataset)}",
    f"Correct predictions: {correct_predictions}",
    f"Incorrect predictions: {incorrect_predictions}",
    f"Test Accuracy: {accuracy:.2%}",
    header,
    "\nClassification Report:\n",
    report,
    header,
    "\nConfusion Matrix (Rows: Actual, Columns: Predicted):\n",
]

matrix_str = " " * 25 + "".join(f"{c[:10]:>12}" for c in class_names) + "\n"
for i, row in enumerate(matrix):
    matrix_str += f"{class_names[i][:24]:<24} " + "".join(f"{val:>12}" for val in row) + "\n"

summary_lines.append(matrix_str)
full_summary = "\n".join(summary_lines)

print(full_summary)

with open(REPORT_PATH, "w", encoding="utf-8") as f:
    f.write(full_summary)

print(f"\nReport successfully saved to: {REPORT_PATH}")
