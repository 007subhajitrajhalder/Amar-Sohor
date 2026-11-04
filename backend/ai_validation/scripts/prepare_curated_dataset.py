
from pathlib import Path
import csv
import shutil

# Find the ai_validation project directory.
AI_DIR = Path(__file__).resolve().parent.parent

# Original images: these must remain untouched.
SOURCE_DIR = AI_DIR / "raw" / "overflowing_dustbin"

# Your completed review CSV.
CSV_PATH = AI_DIR / "review_sheets" / "review_manifest.csv"

# A separate folder for approved overflow images.
OUTPUT_DIR = AI_DIR / "dataset" / "curated" / "overflowing_dustbin"

# Check that the required inputs exist.
if not SOURCE_DIR.is_dir():
    raise SystemExit(f"Image folder not found: {SOURCE_DIR}")

if not CSV_PATH.is_file():
    raise SystemExit(f"CSV file not found: {CSV_PATH}")

# Read the decisions from the CSV.
with CSV_PATH.open("r", newline="", encoding="utf-8-sig") as file:
    reader = csv.DictReader(file)
    required_columns = {"filename", "review_decision"}

    if not required_columns.issubset(reader.fieldnames or []):
        raise SystemExit(
            "CSV must contain filename and review_decision columns."
        )

    records = list(reader)

# Stop if any decisions are missing or unexpected.
invalid = [
    row for row in records
    if row["review_decision"].strip().lower()
    not in {"keep", "exclude"}
]

if invalid:
    raise SystemExit(
        f"{len(invalid)} rows have missing or invalid decisions. "
        "Fix the CSV before continuing."
    )

# Create the output folder without changing the originals.
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

kept = 0
excluded = 0
missing = []

for row in records:
    filename = row["filename"].strip()
    decision = row["review_decision"].strip().lower()

    # Only copy images marked keep.
    if decision == "exclude":
        excluded += 1
        continue

    # Prevent filenames from referring outside the source folder.
    relative_path = Path(filename)
    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise SystemExit(f"Unsafe filename in CSV: {filename}")

    source = SOURCE_DIR / relative_path

    if not source.is_file():
        missing.append(filename)
        continue

    destination = OUTPUT_DIR / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)

    # Copy; do not move or delete the original.
    shutil.copy2(source, destination)
    kept += 1

print("\nDATASET PREPARATION RESULTS")
print(f"Images copied: {kept}")
print(f"Images excluded: {excluded}")
print(f"Missing kept images: {len(missing)}")
print(f"Curated folder: {OUTPUT_DIR}")

if missing:
    print("\nMissing files (first 20):")
    for filename in missing[:20]:
        print(filename)

print("\nOriginal images were not moved or deleted.")
