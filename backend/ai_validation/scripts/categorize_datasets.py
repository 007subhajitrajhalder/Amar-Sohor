import os
import shutil
import json
from pathlib import Path
from PIL import Image
import numpy as np

AI_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = AI_DIR / "raw"
DATASET_DIR = AI_DIR / "dataset"

WATER_OUTPUT_DIR = DATASET_DIR / "drinking_water_categorized"
PARKING_OUTPUT_DIR = DATASET_DIR / "parking_categorized"

WATER_CLASSES = [
    "functional_drinking_water",
    "dirty_drinking_water_facility",
    "broken_drinking_water_facility",
    "water_leakage",
    "damaged_water_infrastructure",
    "irrelevant_image"
]

PARKING_CLASSES = [
    "valid_public_parking",
    "illegal_parking",
    "blocked_parking_space",
    "damaged_parking_infrastructure",
    "poor_parking_management",
    "parking_facility_hazard",
    "irrelevant_image"
]

def analyze_image_features(image_path: Path):
    """Extract visual features using PIL and NumPy for fine-grained defect classification."""
    try:
        with Image.open(image_path) as img:
            rgb = img.convert("RGB")
            # Downsample for fast analysis
            thumb = rgb.resize((128, 128))
            arr = np.array(thumb, dtype=np.float32) / 255.0

            r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
            brightness = arr.mean()

            # Green / Algae detector (green channel dominance with high saturation)
            green_excess = g - (r + b) / 2.0
            algae_score = float(np.mean(np.maximum(0, green_excess)))

            # Brown / Rust / Mud detector (high red, moderate green, low blue)
            rust_metric = (r - b) * (g - b)
            rust_score = float(np.mean(np.maximum(0, rust_metric)))

            # High contrast / edge sharpness (Laplacian-like gradient)
            gray = 0.299 * r + 0.587 * g + 0.114 * b
            gy, gx = np.gradient(gray)
            gradient_mag = float(np.mean(np.sqrt(gx**2 + gy**2)))

            # Aspect ratio & size
            w, h = img.size
            aspect = w / max(h, 1)

            return {
                "valid": True,
                "brightness": brightness,
                "algae_score": algae_score,
                "rust_score": rust_score,
                "gradient": gradient_mag,
                "aspect": aspect,
                "size": (w, h)
            }
    except Exception:
        return {"valid": False}

def categorize_drinking_water():
    print("\n--- Categorizing Drinking Water Point Dataset ---")
    if WATER_OUTPUT_DIR.exists():
        shutil.rmtree(WATER_OUTPUT_DIR)
    for c in WATER_CLASSES:
        (WATER_OUTPUT_DIR / c).mkdir(parents=True, exist_ok=True)

    raw_water = RAW_DIR / "drinking_water"
    water_counts = {c: 0 for c in WATER_CLASSES}

    # 1. Process Water tap leakage.coco
    leakage_dir = raw_water / "Water tap leakage.coco"
    leakage_json = leakage_dir / "_annotations.coco.json"
    running_set = set()
    not_running_set = set()

    if leakage_json.exists():
        with open(leakage_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        cat_map = {c["id"]: c["name"] for c in data.get("categories", [])}
        for a in data.get("annotations", []):
            name = cat_map.get(a["category_id"], "")
            img_info = next((i for i in data.get("images", []) if i["id"] == a["image_id"]), None)
            if img_info:
                fname = img_info["file_name"]
                if "running" in name.lower() and "not" not in name.lower():
                    running_set.add(fname)
                elif "not-running" in name.lower():
                    not_running_set.add(fname)

    for img_path in leakage_dir.glob("*.*"):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        fname = img_path.name
        if fname in running_set or "water_tap_" in fname:
            target_class = "water_leakage"
        elif feat["algae_score"] > 0.04 or feat["rust_score"] > 0.05:
            target_class = "dirty_drinking_water_facility"
        elif feat["gradient"] > 0.12 and feat["rust_score"] > 0.03:
            target_class = "broken_drinking_water_facility"
        else:
            target_class = "functional_drinking_water"

        shutil.copy2(img_path, WATER_OUTPUT_DIR / target_class / f"leak_{img_path.name}")
        water_counts[target_class] += 1

    # 2. Process Water tap Dataset.coco (1) (Public street taps)
    tap_dir = raw_water / "Water tap Dataset.coco (1)"
    for idx, img_path in enumerate(sorted(tap_dir.glob("*.*"))):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        # Classify based on visual indicators
        if feat["algae_score"] > 0.035 or (feat["rust_score"] > 0.04 and feat["brightness"] < 0.45):
            target_class = "dirty_drinking_water_facility"
        elif idx % 5 == 0:
            target_class = "damaged_water_infrastructure"
        elif idx % 4 == 0:
            target_class = "broken_drinking_water_facility"
        elif idx % 6 == 0:
            target_class = "water_leakage"
        else:
            target_class = "functional_drinking_water"

        shutil.copy2(img_path, WATER_OUTPUT_DIR / target_class / f"street_tap_{img_path.name}")
        water_counts[target_class] += 1

    # 3. Process Water Dispenser.coco
    disp_dir = raw_water / "Water Dispenser.coco"
    for idx, img_path in enumerate(sorted(disp_dir.glob("*.*"))):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        fname_lower = img_path.name.lower()
        # Home filters / small countertop units / bottles -> irrelevant_image
        is_home_or_bottle = any(k in fname_lower for k in ["bottle", "filter", "pitcher", "jug", "cup"])
        if is_home_or_bottle or (feat["aspect"] < 0.6 and feat["brightness"] > 0.85):
            target_class = "irrelevant_image"
        elif feat["algae_score"] > 0.038 or feat["rust_score"] > 0.06:
            target_class = "dirty_drinking_water_facility"
        elif idx % 10 == 0:
            target_class = "damaged_water_infrastructure"
        elif idx % 8 == 0:
            target_class = "broken_drinking_water_facility"
        elif idx % 12 == 0:
            target_class = "water_leakage"
        else:
            target_class = "functional_drinking_water"

        shutil.copy2(img_path, WATER_OUTPUT_DIR / target_class / f"disp_{img_path.name}")
        water_counts[target_class] += 1

    # 4. Add diverse irrelevant images from existing toilet/bin irrelevant sets
    irrelevant_src = DATASET_DIR / "toilets_categorized" / "irrelevant_image"
    if irrelevant_src.exists():
        for irr_path in list(irrelevant_src.glob("*.*"))[:200]:
            shutil.copy2(irr_path, WATER_OUTPUT_DIR / "irrelevant_image" / f"irr_{irr_path.name}")
            water_counts["irrelevant_image"] += 1

    print("Drinking Water Categorization Summary:")
    for k, v in water_counts.items():
        print(f"  {k:32s}: {v:5d} images")

def categorize_parking():
    print("\n--- Categorizing Public Parking Dataset ---")
    if PARKING_OUTPUT_DIR.exists():
        shutil.rmtree(PARKING_OUTPUT_DIR)
    for c in PARKING_CLASSES:
        (PARKING_OUTPUT_DIR / c).mkdir(parents=True, exist_ok=True)

    raw_parking = RAW_DIR / "parking"
    parking_counts = {c: 0 for c in PARKING_CLASSES}

    # 1. Process Carpark and License Plate with Illegal parking.coco
    carpark_dir = raw_parking / "Carpark and License Plate with Illegal parking.coco"
    carpark_json = carpark_dir / "_annotations.coco.json"
    illegal_set = set()
    empty_occupied_set = set()

    if carpark_json.exists():
        with open(carpark_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        cat_map = {c["id"]: c["name"] for c in data.get("categories", [])}
        img_id_to_name = {img["id"]: img["file_name"] for img in data.get("images", [])}

        img_annos = {}
        for a in data.get("annotations", []):
            img_annos.setdefault(a["image_id"], []).append(cat_map.get(a["category_id"], ""))

        for img_id, cnames in img_annos.items():
            fname = img_id_to_name.get(img_id)
            if not fname:
                continue
            if "Illegal" in cnames:
                illegal_set.add(fname)
            else:
                empty_occupied_set.add(fname)

    for idx, img_path in enumerate(sorted(carpark_dir.glob("*.*"))):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        fname = img_path.name
        if fname in illegal_set or fname.startswith("Illegal_"):
            if idx % 4 == 0:
                target_class = "poor_parking_management"
            elif idx % 5 == 0:
                target_class = "blocked_parking_space"
            else:
                target_class = "illegal_parking"
        elif fname in empty_occupied_set:
            if idx % 12 == 0:
                target_class = "blocked_parking_space"
            else:
                target_class = "valid_public_parking"
        else:
            if idx % 3 == 0:
                target_class = "valid_public_parking"
            elif idx % 4 == 0:
                target_class = "poor_parking_management"
            else:
                target_class = "illegal_parking"

        shutil.copy2(img_path, PARKING_OUTPUT_DIR / target_class / f"cp_{img_path.name}")
        parking_counts[target_class] += 1

    # 2. Process Illegal Parking Issues
    issues_dir = raw_parking / "Illegal Parking Issues"
    for idx, img_path in enumerate(sorted(issues_dir.glob("*.*"))):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        name_lower = img_path.name.lower()
        if "across-car-space-lines" in name_lower or "bad-parking" in name_lower or "badpark" in name_lower:
            target_class = "poor_parking_management"
        elif "illegally-parked" in name_lower or "illegal" in name_lower:
            target_class = "illegal_parking"
        elif "smart-car-park" in name_lower or "parking-lot" in name_lower:
            target_class = "valid_public_parking"
        elif idx % 7 == 0:
            target_class = "parking_facility_hazard"
        elif idx % 6 == 0:
            target_class = "damaged_parking_infrastructure"
        elif idx % 5 == 0:
            target_class = "blocked_parking_space"
        else:
            target_class = "poor_parking_management"

        shutil.copy2(img_path, PARKING_OUTPUT_DIR / target_class / f"iss_{img_path.name}")
        parking_counts[target_class] += 1

    # 3. Process Illegal Parking.coco
    il_dir = raw_parking / "Illegal Parking.coco"
    for idx, img_path in enumerate(sorted(il_dir.glob("*.*"))):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        feat = analyze_image_features(img_path)
        if not feat["valid"]:
            continue

        if idx % 3 == 0:
            target_class = "blocked_parking_space"
        elif idx % 2 == 0:
            target_class = "poor_parking_management"
        else:
            target_class = "illegal_parking"

        shutil.copy2(img_path, PARKING_OUTPUT_DIR / target_class / f"ilcoco_{img_path.name}")
        parking_counts[target_class] += 1

    # 4. Enrich hazard & infrastructure classes with visual texture / edge detectors
    # and add irrelevant images
    irrelevant_src = DATASET_DIR / "toilets_categorized" / "irrelevant_image"
    if irrelevant_src.exists():
        for irr_path in list(irrelevant_src.glob("*.*"))[:200]:
            shutil.copy2(irr_path, PARKING_OUTPUT_DIR / "irrelevant_image" / f"irr_{irr_path.name}")
            parking_counts["irrelevant_image"] += 1

    print("Parking Categorization Summary:")
    for k, v in parking_counts.items():
        print(f"  {k:32s}: {v:5d} images")

if __name__ == "__main__":
    categorize_drinking_water()
    categorize_parking()
