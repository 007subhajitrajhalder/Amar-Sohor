
from pathlib import Path
import random
import shutil

from PIL import Image

# Find the dataset directory relative to this script.
SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_DIR = SCRIPT_DIR.parent / "dataset"

# Original reviewed image folders.
SOURCE_DIRS = {
    "overflowing_dustbin": DATASET_DIR / "curated" / "overflowing_dustbin",
    "broken_bin": DATASET_DIR / "reviewed_excluded" / "broken_bin",
    "normal_bin": DATASET_DIR / "reviewed_excluded" / "normal_bin",
    "irrelevant_image": DATASET_DIR / "reviewed_excluded" / "irrelevant_image",
}

# Use a new folder so the existing split stays untouched.
OUTPUT_DIR = DATASET_DIR / "split_v2"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
RANDOM_SEED = 42


def is_readable_image(path):
    """Return True if Pillow can verify the image file."""
    try:
        with Image.open(path) as image:
            image.verify()
        return True
    except Exception:
        return False


def main():
    if OUTPUT_DIR.exists():
        raise FileExistsError(
            f"{OUTPUT_DIR} already exists. "
            "Do not overwrite it; inspect it or choose a new output folder."
        )

    random.seed(RANDOM_SEED)

    # Validate source folders and collect readable images.
    images_by_class = {}

    for class_name, source_dir in SOURCE_DIRS.items():
        if not source_dir.is_dir():
            raise FileNotFoundError(
                f"Missing source folder: {source_dir}"
            )

        paths = sorted(
            path for path in source_dir.iterdir()
            if path.is_file()
            and path.suffix.lower() in IMAGE_EXTENSIONS
        )

        readable = []
        unreadable = []

        for path in paths:
            if is_readable_image(path):
                readable.append(path)
            else:
                unreadable.append(path)

        if unreadable:
            names = ", ".join(path.name for path in unreadable[:10])
            raise ValueError(
                f"{class_name} has {len(unreadable)} unreadable image(s). "
                f"Examples: {names}. Fix these before splitting."
            )

        if len(readable) < 3:
            raise ValueError(
                f"Not enough images in class {class_name}."
            )

        images_by_class[class_name] = readable

    # Create a separate train/validation/test split for every class.
    split_counts = {
        "train": {},
        "validation": {},
        "test": {},
    }

    try:
        for split_name in split_counts:
            for class_name in SOURCE_DIRS:
                (OUTPUT_DIR / split_name / class_name).mkdir(
                    parents=True,
                    exist_ok=True,
                )

        for class_name, paths in images_by_class.items():
            random.shuffle(paths)

            total = len(paths)
            train_end = int(total * 0.70)
            validation_end = train_end + int(total * 0.15)

            groups = {
                "train": paths[:train_end],
                "validation": paths[train_end:validation_end],
                "test": paths[validation_end:],
            }

            for split_name, group in groups.items():
                destination = OUTPUT_DIR / split_name / class_name

                for source_path in group:
                    shutil.copy2(
                        source_path,
                        destination / source_path.name,
                    )

                split_counts[split_name][class_name] = len(group)

        print("FOUR-CLASS DATASET CREATED")
        print("=" * 45)

        grand_total = 0

        for split_name, class_counts in split_counts.items():
            print(f"\n{split_name.upper()}")
            split_total = 0

            for class_name, count in class_counts.items():
                print(f"  {class_name}: {count}")
                split_total += count

            print(f"  Split total: {split_total}")
            grand_total += split_total

        print("\nGrand total:", grand_total)
        print("Output:", OUTPUT_DIR)
        print("Original source images were not modified.")

    except Exception:
        shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
        raise


if __name__ == "__main__":
    main()


