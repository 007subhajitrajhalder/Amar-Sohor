
from pathlib import Path
import csv
from PIL import Image, ImageDraw
import math

# 1. Find our project folders
AI_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = AI_DIR / "raw" / "overflowing_dustbin"
REVIEW_DIR = AI_DIR / "review_sheets"

# 2. Configure the contact sheets
IMAGES_PER_SHEET = 100
COLUMNS = 5
CELL_WIDTH = 180
CELL_HEIGHT = 150
LABEL_HEIGHT = 25

SUPPORTED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".bmp"
}

# 3. Check that the input folder exists
if not IMAGE_DIR.exists():
    raise SystemExit(f"Image folder not found: {IMAGE_DIR}")

# 4. Find all image files, including those in subfolders
image_paths = sorted(
    path for path in IMAGE_DIR.rglob("*")
    if path.is_file()
    and path.suffix.lower() in SUPPORTED_EXTENSIONS
)

if not image_paths:
    raise SystemExit("No images were found.")

# 5. Create the output folder
REVIEW_DIR.mkdir(parents=True, exist_ok=True)

# 6. Calculate how many sheets we need
total_sheets = math.ceil(len(image_paths) / IMAGES_PER_SHEET)

# 7. Prepare a CSV manifest linking IDs to filenames
manifest_path = REVIEW_DIR / "review_manifest.csv"

with manifest_path.open("w", newline="", encoding="utf-8") as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow([
        "image_id",
        "filename",
        "review_decision"
    ])

    for index, path in enumerate(image_paths, start=1):
        writer.writerow([
            index,
            str(path.relative_to(IMAGE_DIR)),
            ""
        ])

# 8. Generate each numbered contact sheet
for sheet_index in range(total_sheets):
    start = sheet_index * IMAGES_PER_SHEET
    end = min(start + IMAGES_PER_SHEET, len(image_paths))
    batch = image_paths[start:end]

    rows = math.ceil(len(batch) / COLUMNS)

    sheet = Image.new(
        "RGB",
        (
            COLUMNS * CELL_WIDTH,
            rows * (CELL_HEIGHT + LABEL_HEIGHT)
        ),
        "white"
    )

    draw = ImageDraw.Draw(sheet)

    for position, path in enumerate(batch):
        image_id = start + position + 1

        try:
            with Image.open(path) as original:
                image = original.convert("RGB")
                image.thumbnail(
                    (CELL_WIDTH - 10, CELL_HEIGHT - 10)
                )

                column = position % COLUMNS
                row = position // COLUMNS

                x = column * CELL_WIDTH
                y = row * (CELL_HEIGHT + LABEL_HEIGHT)

                sheet.paste(image, (x + 5, y + 5))

                draw.text(
                    (x + 5, y + CELL_HEIGHT + 2),
                    f"ID: {image_id}",
                    fill="black"
                )

        except Exception as error:
            print(f"Could not preview {path.name}: {error}")

    output_path = REVIEW_DIR / f"sheet_{sheet_index + 1:03d}.jpg"
    sheet.save(output_path, quality=90)

    print(f"Created {output_path.name}: IDs {start + 1}-{end}")

print("\nReview preparation complete!")
print(f"Total images: {len(image_paths)}")
print(f"Total contact sheets: {total_sheets}")
print(f"CSV manifest: {manifest_path}")
print("Original images were not modified.")
