
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

# Use the corrected dataset
DATASET_DIR = SCRIPT_DIR.parent / "dataset" / "split_v3"

# Load Model V2, not the original model
CHECKPOINT_PATH = (
    SCRIPT_DIR.parent
    / "models"
    / "mobilenetv3_amar_sohor_v2.pth"
)

# Save results separately
REPORT_DIR = SCRIPT_DIR.parent / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

REPORT_PATH = REPORT_DIR / "evaluation_v2.txt"

DEVICE = torch.device("cpu")
BATCH_SIZE = 8


# --------------------------------------------------
# 2. Load the test dataset
# --------------------------------------------------

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
    "Dataset class order does not match model class order!"
)


# --------------------------------------------------
# 4. Re-create the model architecture
# --------------------------------------------------

model = mobilenet_v3_large(weights=None)

input_features = model.classifier[3].in_features

model.classifier[3] = nn.Linear(
    input_features,
    len(class_names),
)

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

accuracy = accuracy_score(
    all_labels,
    all_predictions,
)

correct_predictions = sum(
    actual == predicted
    for actual, predicted in zip(
        all_labels,
        all_predictions,
    )
)

incorrect_predictions = len(test_dataset) - correct_predictions


# --------------------------------------------------
# 7. Generate classification report
# --------------------------------------------------

report = classification_report(
    all_labels,
    all_predictions,
    labels=list(range(len(class_names))),
    target_names=class_names,
    digits=3,
    zero_division=0,
)


# --------------------------------------------------
# 8. Generate confusion matrix
# --------------------------------------------------

matrix = confusion_matrix(
    all_labels,
    all_predictions,
    labels=list(range(len(class_names))),
)


# --------------------------------------------------
# 9. Display evaluation results
# --------------------------------------------------

results = f"""
AMAR SOHOR - MODEL V2 EVALUATION
================================

Checkpoint epoch: {checkpoint['epoch']}

Best validation accuracy:
{checkpoint['validation_accuracy']:.2%}

Number of test images:
{len(test_dataset)}

Correct predictions:
{correct_predictions}

Incorrect predictions:
{incorrect_predictions}

Test accuracy:
{accuracy:.2%}


CLASSIFICATION REPORT
=====================

{report}


CONFUSION MATRIX
================

Rows = actual classes
Columns = predicted classes

Class order:
{class_names}

{matrix}
"""

print(results)


# --------------------------------------------------
# 10. Save evaluation results
# --------------------------------------------------

REPORT_PATH.write_text(
    results,
    encoding="utf-8",
)

print("Evaluation report saved to:")
print(REPORT_PATH)
