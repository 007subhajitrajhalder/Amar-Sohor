
from pathlib import Path
from collections import Counter
from PIL import Image

# Find the AI dataset folder relative to this script
AI_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = AI_DIR / "raw"

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tif", ".tiff"
}

print("=" * 50)
print("AMAR SOHOR - DATASET INSPECTION")
print("=" * 50)

if not RAW_DIR.exists():
    print(f"ERROR: Raw folder not found: {RAW_DIR}")
    raise SystemExit(1)

for class_dir in sorted(RAW_DIR.iterdir()):
    if not class_dir.is_dir():
        continue

    files = [
        path for path in class_dir.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    ]

    valid_count = 0
    invalid_files = []
    extensions = Counter()

    for path in files:
        extensions[path.suffix.lower()] += 1

        try:
            with Image.open(path) as image:
                image.verify()
            valid_count += 1
        except Exception:
            invalid_files.append(path)

    print(f"\nClass/folder: {class_dir.name}")
    print(f"Image files found: {len(files)}")
    print(f"Images passing file check: {valid_count}")
    print(f"Images that may be corrupted: {len(invalid_files)}")
    print(f"File types: {dict(extensions)}")

    for path in invalid_files[:10]:
        print(f"  CHECK: {path.name}")

print("\nInspection complete. No files were deleted or moved.")
