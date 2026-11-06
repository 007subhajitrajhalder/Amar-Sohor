
from pathlib import Path
import csv
import random
import math

from PIL import Image, ImageDraw, ImageFont


# 1. Find project directories
SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent

TRAIN_DIR = AI_DIR / "dataset" / "split_v2" / "train"
REPORT_DIR = AI_DIR / "reports"

# 2. Audit configuration
SAMPLES_PER_CLASS = 25
IMAGES_PER_SHEET = 20
RANDOM_SEED = 42

VALID_CLASSES = [
    "broken_bin",
    "irrelevant_image",
    "normal_bin",
    "overflowing_dustbin",
]

random.seed(RANDOM_SEED)


# 3. Create output directory
REPORT_DIR.mkdir(parents=True, exist_ok=True)

audit_items = []


# 4. Collect images from each training class
for class_name in VALID_CLASSES:

    class_dir = TRAIN_DIR / class_name

    image_paths = sorted([
        path for path in class_dir.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png"}
    ])

    # Select up to 25 images from this class.
    sample_count = min(
        SAMPLES_PER_CLASS,
        len(image_paths)
    )

    selected_images = random.sample(
        image_paths,
        sample_count
    )

    for image_path in selected_images:
        audit_items.append({
            "filename": image_path.name,
            "actual": class_name,
            "image_path": str(image_path),
        })


# 5. Save the audit CSV
csv_path = REPORT_DIR / "training_audit.csv"

with open(
    csv_path,
    "w",
    newline="",
    encoding="utf-8"
) as file:

    fieldnames = [
        "filename",
        "actual",
        "image_path",
        "review_decision",
        "correct_label",
        "reason",
        "review_status",
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    for item in audit_items:
        writer.writerow({
            **item,
            "review_decision": "",
            "correct_label": "",
            "reason": "",
            "review_status": "pending",
        })


# 6. Load a readable font
def get_font():
    try:
        return ImageFont.truetype("arial.ttf", 13)
    except OSError:
        return ImageFont.load_default()


# 7. Generate contact sheets
def create_contact_sheet(items, sheet_number):

    columns = 4
    rows = math.ceil(len(items) / columns)

    cell_width = 240
    cell_height = 220

    sheet = Image.new(
        "RGB",
        (columns * cell_width, rows * cell_height),
        "white"
    )

    draw = ImageDraw.Draw(sheet)
    font = get_font()

    for index, item in enumerate(items):

        image = Image.open(
            item["image_path"]
        ).convert("RGB")

        image.thumbnail((210, 165))

        column = index % columns
        row = index // columns

        x = column * cell_width
        y = row * cell_height

        image_x = x + (cell_width - image.width) // 2

        sheet.paste(image, (image_x, y + 5))

        draw.text(
            (x + 5, y + 175),
            item["filename"],
            fill="black",
            font=font
        )

        draw.text(
            (x + 5, y + 195),
            f"Actual: {item['actual']}",
            fill="black",
            font=font
        )

    output_path = REPORT_DIR / (
        f"training_audit_sheet_{sheet_number}.jpg"
    )

    sheet.save(output_path, quality=90)

    print("Saved:", output_path)


# 8. Divide images into groups of 20
for start in range(
    0,
    len(audit_items),
    IMAGES_PER_SHEET
):

    group = audit_items[
        start:start + IMAGES_PER_SHEET
    ]

    sheet_number = start // IMAGES_PER_SHEET + 1

    create_contact_sheet(group, sheet_number)


# 9. Print summary
print("\nTRAINING DATA AUDIT CREATED")
print("Images selected:", len(audit_items))
print("CSV:", csv_path)
print("Reports directory:", REPORT_DIR)
