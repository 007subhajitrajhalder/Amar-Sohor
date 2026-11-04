
from pathlib import Path
import random
import shutil

from sklearn.model_selection import train_test_split
from PIL import Image


# --------------------------------------------------
# 1. Locate the project and define the folders
# --------------------------------------------------

# __file__ is the path of this Python script.
# parent.parent takes us from scripts/ to ai_validation/.
AI_DIR = Path(__file__).resolve().parent.parent

SOURCE_DIRS = {
    "overflowing_dustbin":
        AI_DIR / "dataset" / "curated" / "overflowing_dustbin",

    "normal_bin":
        AI_DIR / "dataset" / "reviewed_excluded" / "normal_bin",

    "irrelevant_image":
        AI_DIR / "dataset" / "reviewed_excluded" / "irrelevant_image",
}

OUTPUT_DIR = AI_DIR / "dataset" / "split"

RANDOM_SEED = 42

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


# --------------------------------------------------
# 2. Check that the input folders exist
# --------------------------------------------------

if OUTPUT_DIR.exists():
    raise SystemExit(
        f"Output folder already exists: {OUTPUT_DIR}\n"
        "Rename or inspect it before running this script again."
    )

for category, folder in SOURCE_DIRS.items():
    if not folder.is_dir():
        raise SystemExit(
            f"Missing source folder for {category}: {folder}"
        )


# --------------------------------------------------
# 3. Collect and verify the image files
# --------------------------------------------------

class_images = {}
unreadable_images = []

for category, folder in SOURCE_DIRS.items():

    # Get image files directly inside this category folder.
    paths = sorted(
        path for path in folder.iterdir()
        if path.is_file()
        and path.suffix.lower() in IMAGE_EXTENSIONS
    )

    valid_paths = []

    for path in paths:
        try:
            with Image.open(path) as image:
                image.verify()

            valid_paths.append(path)

        except Exception as error:
            unreadable_images.append((category, path.name))
            print(f"Unreadable image: {path.name} ({error})")

    if len(valid_paths) < 3:
        raise SystemExit(
            f"Not enough readable images in {category}: "
            f"{len(valid_paths)}"
        )

    class_images[category] = valid_paths


# Stop before copying if any images need attention.
if unreadable_images:
    raise SystemExit(
        f"\nFound {len(unreadable_images)} unreadable images.\n"
        "Please review or remove those files from the source "
        "dataset, then run this script again."
    )


# --------------------------------------------------
# 4. Split each category separately
# --------------------------------------------------

splits = {
    "train": [],
    "validation": [],
    "test": [],
}

for category, paths in class_images.items():

    # First: 70% for training, 30% remaining.
    train_paths, remaining_paths = train_test_split(
        paths,
        test_size=0.30,
        random_state=RANDOM_SEED,
        shuffle=True,
    )

    # Second: split the remaining 30% equally.
    validation_paths, test_paths = train_test_split(
        remaining_paths,
        test_size=0.50,
        random_state=RANDOM_SEED,
        shuffle=True,
    )

    splits["train"].extend(
        (path, category) for path in train_paths
    )

    splits["validation"].extend(
        (path, category) for path in validation_paths
    )

    splits["test"].extend(
        (path, category) for path in test_paths
    )


# Shuffle the order of images inside each split.
rng = random.Random(RANDOM_SEED)

for items in splits.values():
    rng.shuffle(items)


# --------------------------------------------------
# 5. Copy images to the output folders
# --------------------------------------------------

try:
    for split_name, items in splits.items():

        for source, category in items:

            destination = (
                OUTPUT_DIR
                / split_name
                / category
                / source.name
            )

            # Create destination folders if necessary.
            destination.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            # Refuse to overwrite an existing image.
            if destination.exists():
                raise FileExistsError(destination)

            # Copy the image; keep the source untouched.
            shutil.copy2(source, destination)

except Exception:
    # If copying fails halfway, remove the partial split
    # so it cannot be mistaken for a complete dataset.
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    raise


# --------------------------------------------------
# 6. Print a summary of the finished split
# --------------------------------------------------

print("\nDATASET SPLIT RESULTS")

grand_total = 0

for split_name, items in splits.items():

    print(f"\n{split_name.upper()}")
    split_total = 0

    for category in SOURCE_DIRS:

        count = sum(
            1
            for _, item_category in items
            if item_category == category
        )

        print(f"  {category}: {count}")
        split_total += count

    print(f"  Total: {split_total}")
    grand_total += split_total

print(f"\nGrand total: {grand_total}")
print(f"Output folder: {OUTPUT_DIR}")
print("Original source images were not moved or deleted.")
