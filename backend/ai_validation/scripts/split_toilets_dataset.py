from pathlib import Path
import random
import shutil
from sklearn.model_selection import train_test_split
from PIL import Image

AI_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = AI_DIR / "dataset" / "toilets_categorized"
OUTPUT_DIR = AI_DIR / "dataset" / "split_toilets"

RANDOM_SEED = 42
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

if OUTPUT_DIR.exists():
    print(f"Removing existing split directory: {OUTPUT_DIR}")
    shutil.rmtree(OUTPUT_DIR)

categories = sorted([d.name for d in SOURCE_DIR.iterdir() if d.is_dir()])
print(f"Found {len(categories)} categories: {categories}")

class_images = {}
unreadable_images = []

for category in categories:
    folder = SOURCE_DIR / category
    paths = sorted(
        path for path in folder.iterdir()
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )

    valid_paths = []
    for path in paths:
        try:
            with Image.open(path) as img:
                img.verify()
            valid_paths.append(path)
        except Exception as error:
            unreadable_images.append((category, path.name))
            print(f"Unreadable image in {category}: {path.name} ({error})")

    if len(valid_paths) < 3:
        raise SystemExit(f"Not enough readable images in {category}: {len(valid_paths)}")

    class_images[category] = valid_paths
    print(f"  {category:25s}: {len(valid_paths):4d} valid images")

if unreadable_images:
    raise SystemExit(f"Found {len(unreadable_images)} unreadable images. Please fix before splitting.")

splits = {
    "train": [],
    "val": [],
    "test": [],
}

print("\nSplitting images (70% train, 15% validation, 15% test, seed=42)...")
for category, paths in class_images.items():
    # 70% train, 30% remainder
    train_paths, remaining_paths = train_test_split(
        paths,
        test_size=0.30,
        random_state=RANDOM_SEED,
        shuffle=True,
    )

    # 15% val, 15% test
    val_paths, test_paths = train_test_split(
        remaining_paths,
        test_size=0.50,
        random_state=RANDOM_SEED,
        shuffle=True,
    )

    splits["train"].extend((path, category) for path in train_paths)
    splits["val"].extend((path, category) for path in val_paths)
    splits["test"].extend((path, category) for path in test_paths)

    print(f"  {category:25s}: train={len(train_paths):4d}, val={len(val_paths):4d}, test={len(test_paths):4d}")

rng = random.Random(RANDOM_SEED)
for items in splits.values():
    rng.shuffle(items)

print("\nCopying images to output split folders...")
for split_name, items in splits.items():
    for source, category in items:
        destination = OUTPUT_DIR / split_name / category / source.name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)

print("\nSplit completed successfully!")
for split_name in ["train", "val", "test"]:
    total_split = sum(len(list((OUTPUT_DIR / split_name / cat).iterdir())) for cat in categories)
    print(f"  Total {split_name:5s}: {total_split:4d} images")
