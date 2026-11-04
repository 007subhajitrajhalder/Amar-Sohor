
from pathlib import Path
import csv
import shutil
from collections import Counter

# Find the ai_validation project directory.
AI_DIR = Path(__file__).resolve().parent.parent

# Original photos: read and copy only.
SOURCE_DIR = AI_DIR / "raw" / "overflowing_dustbin"

# Your completed categorisation CSV.
CSV_PATH = (
    AI_DIR / "review_sheets"
    / "excluded_review" / "excluded_review_manifest.csv"
)

# Each category gets its own separate destination folder.
OUTPUT_DIR = AI_DIR / "dataset" / "reviewed_excluded"

ALLOWED_CATEGORIES = {
    "normal_bin",
    "broken_bin",
    "irrelevant_image",
    "uncertain",
}

# Check that the required inputs exist.
if not SOURCE_DIR.is_dir():
    raise SystemExit(f"Source folder not found: {SOURCE_DIR}")

if not CSV_PATH.is_file():
    raise SystemExit(f"Categorisation CSV not found: {CSV_PATH}")

# Load the categorisation CSV.
with CSV_PATH.open(
    "r", newline="", encoding="utf-8-sig"
) as file:
    reader = csv.DictReader(file)

    required = {"filename", "category"}
    if not required.issubset(reader.fieldnames or []):
        raise SystemExit(
            "CSV must contain filename and category columns."
        )

    records = list(reader)

# Validate all records before copying files.
seen = set()
counts = Counter()

for row in records:
    filename = row["filename"].strip()
    category = row["category"].strip().lower()

    if not filename or category not in ALLOWED_CATEGORIES:
        raise SystemExit(
            f"Missing filename or invalid category: {row}"
        )

    relative_path = Path(filename)

    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise SystemExit(f"Unsafe filename: {filename}")

    if filename in seen:
        raise SystemExit(f"Duplicate filename in CSV: {filename}")

    seen.add(filename)
    counts[category] += 1

# Check source files before copying anything.
missing = [
    row["filename"].strip()
    for row in records
    if not (
        SOURCE_DIR / row["filename"].strip()
    ).is_file()
]

if missing:
    raise SystemExit(
        f"{len(missing)} source images are missing. "
        f"First examples: {missing[:10]}"
    )

# Copy files into their category folders.
# Existing files are not overwritten.
for row in records:
    filename = row["filename"].strip()
    category = row["category"].strip().lower()

    source = SOURCE_DIR / filename
    destination = OUTPUT_DIR / category / filename

    destination.parent.mkdir(parents=True, exist_ok=True)

    if destination.exists():
        raise SystemExit(
            f"Destination already exists; stopping safely: "
            f"{destination}"
        )

    shutil.copy2(source, destination)

print("\nEXCLUDED DATASET PREPARATION RESULTS")
print(f"CSV records: {len(records)}")

for category in sorted(ALLOWED_CATEGORIES):
    print(f"{category}: {counts[category]}")

print(f"Output folder: {OUTPUT_DIR}")
print("Original images and CSV were not changed.")
