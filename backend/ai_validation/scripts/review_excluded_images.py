
from pathlib import Path
import csv
import math

from PIL import Image, ImageDraw, ImageFont

# Locate the project folders.
AI_DIR = Path(__file__).resolve().parent.parent

SOURCE_DIR = AI_DIR / "raw" / "overflowing_dustbin"
ORIGINAL_CSV = AI_DIR / "review_sheets" / "review_manifest.csv"
OUTPUT_DIR = AI_DIR / "review_sheets" / "excluded_review"

# Contact sheet layout: 5 columns x 4 rows = 20 images per sheet.
COLUMNS = 5
ROWS = 4
PER_SHEET = COLUMNS * ROWS
THUMB_WIDTH = 180
THUMB_HEIGHT = 145
LABEL_HEIGHT = 32

if not SOURCE_DIR.is_dir():
    raise SystemExit(f"Image folder not found: {SOURCE_DIR}")

if not ORIGINAL_CSV.is_file():
    raise SystemExit(f"Review CSV not found: {ORIGINAL_CSV}")

# Read the original decisions. We only read this file.
with ORIGINAL_CSV.open(
    "r", newline="", encoding="utf-8-sig"
) as file:
    reader = csv.DictReader(file)

    required = {"filename", "review_decision"}
    if not required.issubset(reader.fieldnames or []):
        raise SystemExit("CSV is missing required columns.")

    excluded_names = [
        row["filename"].strip()
        for row in reader
        if row["review_decision"].strip().lower() == "exclude"
    ]

if not excluded_names:
    raise SystemExit("No excluded images were found.")

# Keep only safe, existing image paths.
images = []
missing = []

for name in excluded_names:
    relative_path = Path(name)

    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise SystemExit(f"Unsafe filename in CSV: {name}")

    path = SOURCE_DIR / relative_path

    if path.is_file():
        images.append((name, path))
    else:
        missing.append(name)

if not images:
    raise SystemExit("No excluded image files were found.")

# Make a separate output folder.
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Create a new CSV, leaving the original review CSV untouched.
manifest_path = OUTPUT_DIR / "excluded_review_manifest.csv"

with manifest_path.open(
    "w", newline="", encoding="utf-8"
) as file:
    writer = csv.writer(file)
    writer.writerow(["image_id", "filename", "category"])

    for image_id, (name, _) in enumerate(images, start=1):
        writer.writerow([image_id, name, ""])

# Create contact sheets without modifying any source image.
font = ImageFont.load_default()
sheet_count = math.ceil(len(images) / PER_SHEET)

for sheet_index in range(sheet_count):
    start = sheet_index * PER_SHEET
    batch = images[start:start + PER_SHEET]

    sheet = Image.new(
        "RGB",
        (
            COLUMNS * THUMB_WIDTH,
            ROWS * (THUMB_HEIGHT + LABEL_HEIGHT)
        ),
        "white"
    )
    draw = ImageDraw.Draw(sheet)

    for position, (name, path) in enumerate(batch):
        try:
            with Image.open(path) as source:
                image = source.convert("RGB")
                image.thumbnail((THUMB_WIDTH - 10, THUMB_HEIGHT - 10))

            col = position % COLUMNS
            row = position // COLUMNS

            x = col * THUMB_WIDTH + (
                THUMB_WIDTH - image.width
            ) // 2
            y = row * (THUMB_HEIGHT + LABEL_HEIGHT) + 3

            sheet.paste(image, (x, y))

            image_id = start + position + 1
            label_y = row * (THUMB_HEIGHT + LABEL_HEIGHT) + THUMB_HEIGHT
            draw.text(
                (col * THUMB_WIDTH + 5, label_y),
                f"ID {image_id}",
                fill="black",
                font=font
            )

        except Exception as error:
            print(f"Could not preview {name}: {error}")

    sheet_path = OUTPUT_DIR / f"sheet_{sheet_index + 1:03}.jpg"
    sheet.save(sheet_path, quality=90)
    print(f"Created: {sheet_path.name}")

print("\nEXCLUDED IMAGE REVIEW FILES CREATED")
print(f"Excluded entries in CSV: {len(excluded_names)}")
print(f"Existing images: {len(images)}")
print(f"Missing images: {len(missing)}")
print(f"Contact sheets: {sheet_count}")
print(f"New review CSV: {manifest_path}")
print("Original images and original CSV were not modified.")
