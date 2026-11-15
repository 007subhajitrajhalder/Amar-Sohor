import shutil
import random
from pathlib import Path
from sklearn.model_selection import train_test_split
from PIL import Image, ImageEnhance, ImageOps

AI_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = AI_DIR / "dataset"
RANDOM_SEED = 42

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def augment_image(src_path: Path, dest_path: Path, aug_type: int):
    with Image.open(src_path) as img:
        rgb = img.convert("RGB")
        if aug_type == 0:
            out = ImageOps.mirror(rgb)
        elif aug_type == 1:
            enh = ImageEnhance.Brightness(rgb)
            out = enh.enhance(1.15)
        elif aug_type == 2:
            enh = ImageEnhance.Contrast(rgb)
            out = enh.enhance(1.2)
        elif aug_type == 3:
            out = rgb.rotate(8, expand=False)
        else:
            out = rgb.rotate(-8, expand=False)
        out.save(dest_path, "JPEG", quality=92)

def prepare_and_split(dataset_name: str, source_dir: Path, output_dir: Path, min_samples: int = 35):
    print(f"\n==========================================")
    print(f"Splitting Dataset: {dataset_name}")
    print(f"Source: {source_dir}")
    print(f"Output: {output_dir}")
    print(f"==========================================")

    if output_dir.exists():
        shutil.rmtree(output_dir)

    categories = sorted([d.name for d in source_dir.iterdir() if d.is_dir()])
    print(f"Found {len(categories)} categories: {categories}")

    class_images = {}
    for cat in categories:
        cat_dir = source_dir / cat
        paths = sorted([
            p for p in cat_dir.iterdir()
            if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
        ])
        
        # Verify valid readable images
        valid = []
        for p in paths:
            try:
                with Image.open(p) as img:
                    img.verify()
                valid.append(p)
            except Exception:
                pass

        # If minor class has fewer than min_samples, augment to min_samples
        if len(valid) < min_samples:
            orig_len = len(valid)
            augmented = list(valid)
            aug_idx = 0
            while len(augmented) < min_samples:
                base_img = valid[aug_idx % orig_len]
                aug_name = f"aug_{len(augmented)}_{base_img.name}"
                aug_path = cat_dir / aug_name
                augment_image(base_img, aug_path, aug_idx % 5)
                augmented.append(aug_path)
                aug_idx += 1
            valid = augmented
            print(f"  {cat:32s}: boosted from {orig_len} to {len(valid)} images")
        else:
            print(f"  {cat:32s}: {len(valid):4d} valid images")

        class_images[cat] = valid

    splits = {"train": [], "val": [], "test": []}

    for cat, paths in class_images.items():
        train_p, rem_p = train_test_split(paths, test_size=0.30, random_state=RANDOM_SEED, shuffle=True)
        val_p, test_p = train_test_split(rem_p, test_size=0.50, random_state=RANDOM_SEED, shuffle=True)

        splits["train"].extend((p, cat) for p in train_p)
        splits["val"].extend((p, cat) for p in val_p)
        splits["test"].extend((p, cat) for p in test_p)

        print(f"  {cat:32s} -> train={len(train_p):4d}, val={len(val_p):4d}, test={len(test_p):4d}")

    for sname, items in splits.items():
        for p, cat in items:
            dest = output_dir / sname / cat / p.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, dest)

    print(f"\n{dataset_name} Split completed!")
    for sname in ["train", "val", "test"]:
        total = sum(len(list((output_dir / sname / c).iterdir())) for c in categories)
        print(f"  Total {sname:5s}: {total:4d} images")

if __name__ == "__main__":
    prepare_and_split(
        "Drinking Water",
        DATASET_DIR / "drinking_water_categorized",
        DATASET_DIR / "split_drinking_water",
        min_samples=40
    )
    prepare_and_split(
        "Public Parking",
        DATASET_DIR / "parking_categorized",
        DATASET_DIR / "split_parking",
        min_samples=40
    )
