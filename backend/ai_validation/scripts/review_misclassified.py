
from pathlib import Path
import csv
import math

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, models
from torchvision.models import MobileNet_V3_Large_Weights
from PIL import Image, ImageDraw, ImageFont


# --------------------------------------------------
# 1. Configure paths and settings
# --------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent

TEST_DIR = AI_DIR / "dataset" / "split_v2" / "test"
MODEL_PATH = AI_DIR / "models" / "mobilenetv3_amar_sohor.pth"
REPORT_DIR = AI_DIR / "reports"

BATCH_SIZE = 8
IMAGES_PER_SHEET = 20
THUMBNAIL_SIZE = (180, 150)

DEVICE = torch.device("cpu")


# --------------------------------------------------
# 2. Load the test dataset
# --------------------------------------------------

weights = MobileNet_V3_Large_Weights.DEFAULT
transform = weights.transforms()

test_dataset = datasets.ImageFolder(
    root=str(TEST_DIR),
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)

class_names = test_dataset.classes

print("Class mapping:", test_dataset.class_to_idx)
print("Test images:", len(test_dataset))
print("Device:", DEVICE)


# --------------------------------------------------
# 3. Rebuild the model and load the trained weights
# --------------------------------------------------

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=True
)

model = models.mobilenet_v3_large(weights=None)

input_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(
    input_features,
    len(class_names)
)

model.load_state_dict(checkpoint["model_state_dict"])
model = model.to(DEVICE)
model.eval()


# --------------------------------------------------
# 4. Predict every test image
# --------------------------------------------------

misclassified = []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        outputs = model(images)

        # Convert model scores into probabilities.
        probabilities = torch.softmax(outputs, dim=1)

        # Get the predicted class and its probability.
        confidence, predictions = torch.max(
            probabilities,
            dim=1
        )

        # Examine each image in this batch.
        for i in range(len(labels)):
            actual_index = labels[i].item()
            predicted_index = predictions[i].item()

            # Keep only incorrect predictions.
            if actual_index != predicted_index:
                image_index = len(misclassified)

                misclassified.append({
                    "actual": class_names[actual_index],
                    "predicted": class_names[predicted_index],
                    "confidence": confidence[i].item(),
                    "image_path": None,
                })


# --------------------------------------------------
# 5. Match predictions to their original image paths
# --------------------------------------------------

# ImageFolder stores samples in the same order used
# by our non-shuffled test DataLoader.
all_image_paths = [path for path, label in test_dataset.samples]

# Re-run prediction bookkeeping in dataset order.
# This second pass keeps the filename associated with
# the correct prediction, without changing any files.

misclassified = []
dataset_index = 0

with torch.no_grad():
    for images, labels in test_loader:
        outputs = model(images.to(DEVICE))
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predictions = torch.max(
            probabilities,
            dim=1
        )

        for i in range(len(labels)):
            actual_index = labels[i].item()
            predicted_index = predictions[i].item()

            if actual_index != predicted_index:
                misclassified.append({
                    "filename": Path(
                        all_image_paths[dataset_index]
                    ).name,
                    "image_path": all_image_paths[dataset_index],
                    "actual": class_names[actual_index],
                    "predicted": class_names[predicted_index],
                    "confidence": confidence[i].item(),
                })

            dataset_index += 1


# --------------------------------------------------
# 6. Create the report folder and CSV file
# --------------------------------------------------

REPORT_DIR.mkdir(parents=True, exist_ok=True)

csv_path = REPORT_DIR / "misclassified_images.csv"

with open(csv_path, "w", newline="", encoding="utf-8") as csv_file:
    fieldnames = [
        "filename",
        "actual",
        "predicted",
        "confidence",
        "image_path",
    ]

    writer = csv.DictWriter(
        csv_file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    for item in misclassified:
        writer.writerow({
            "filename": item["filename"],
            "actual": item["actual"],
            "predicted": item["predicted"],
            "confidence": round(item["confidence"], 4),
            "image_path": item["image_path"],
        })


# --------------------------------------------------
# 7. Build contact sheets of incorrect predictions
# --------------------------------------------------

def get_font(size=14):
    """Load a readable font, with a safe fallback."""
    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def create_contact_sheet(items, sheet_number):
    """Create one page of thumbnails with prediction labels."""

    columns = 4
    rows = math.ceil(len(items) / columns)

    cell_width = 220
    cell_height = 220

    sheet = Image.new(
        "RGB",
        (columns * cell_width, rows * cell_height),
        "white"
    )

    draw = ImageDraw.Draw(sheet)
    font = get_font(13)

    for position, item in enumerate(items):
        image = Image.open(item["image_path"]).convert("RGB")
        image.thumbnail(THUMBNAIL_SIZE)

        column = position % columns
        row = position // columns

        x = column * cell_width
        y = row * cell_height

        # Center the thumbnail within its cell.
        image_x = x + (cell_width - image.width) // 2
        image_y = y + 5

        sheet.paste(image, (image_x, image_y))

        # Add text underneath the image.
        text_y = y + 160
        draw.text(
            (x + 8, text_y),
            f"Actual: {item['actual']}",
            fill="black",
            font=font
        )
        draw.text(
            (x + 8, text_y + 20),
            f"Predicted: {item['predicted']}",
            fill="black",
            font=font
        )
        draw.text(
            (x + 8, text_y + 40),
            f"Confidence: {item['confidence']:.1%}",
            fill="black",
            font=font
        )

    output_path = REPORT_DIR / (
        f"misclassified_contact_sheet_{sheet_number}.jpg"
    )

    sheet.save(output_path, quality=90)
    print("Contact sheet saved:", output_path)


for start in range(0, len(misclassified), IMAGES_PER_SHEET):
    page_items = misclassified[
        start:start + IMAGES_PER_SHEET
    ]

    sheet_number = start // IMAGES_PER_SHEET + 1
    create_contact_sheet(page_items, sheet_number)


# --------------------------------------------------
# 8. Print the final summary
# --------------------------------------------------

print("\nMISCLASSIFIED IMAGE REVIEW COMPLETE")
print("Total test images:", len(test_dataset))
print("Incorrect predictions:", len(misclassified))
print("Correct predictions:", len(test_dataset) - len(misclassified))
print("CSV report:", csv_path)
print("Reports folder:", REPORT_DIR)
