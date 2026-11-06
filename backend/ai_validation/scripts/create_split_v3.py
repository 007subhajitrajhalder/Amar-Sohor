import csv
import shutil
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent
DATASET_DIR = AI_DIR / "dataset"
REPORT_DIR = AI_DIR / "reports"

SRC_SPLIT = DATASET_DIR / "split_v2"
DEST_SPLIT = DATASET_DIR / "split_v3"

TRAINING_AUDIT_CSV = REPORT_DIR / "training_audit.csv"
TEST_REVIEW_CSV = REPORT_DIR / "misclassified_images_reviewed.csv"
LOG_CSV = REPORT_DIR / "dataset_v3_corrections_log.csv"

VALID_CLASSES = {"broken_bin", "irrelevant_image", "normal_bin", "overflowing_dustbin"}


def collect_corrections():
    corrections = []

    # 1. Training audit corrections
    if TRAINING_AUDIT_CSV.exists():
        with open(TRAINING_AUDIT_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("review_decision") == "correct_label":
                    fn = row["filename"]
                    orig_cls = row["actual"]
                    corr_cls = row["correct_label"]
                    reason = row.get("reason", "")
                    corrections.append({
                        "filename": fn,
                        "split": "train",
                        "source_review": "training_audit.csv",
                        "original_class": orig_cls,
                        "corrected_class": corr_cls,
                        "reason": reason,
                    })

    # 2. Test misclassification review corrections
    if TEST_REVIEW_CSV.exists():
        with open(TEST_REVIEW_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("review_decision") == "correct_label":
                    fn = row["filename"]
                    orig_cls = row["actual"]
                    corr_cls = row["correct_label"]
                    reason = row.get("reason", "")
                    corrections.append({
                        "filename": fn,
                        "split": "test",
                        "source_review": "misclassified_images_reviewed.csv",
                        "original_class": orig_cls,
                        "corrected_class": corr_cls,
                        "reason": reason,
                    })

    return corrections


def main():
    if not SRC_SPLIT.exists():
        raise FileNotFoundError(f"Source split folder not found: {SRC_SPLIT}")

    if DEST_SPLIT.exists():
        print(f"Warning: Destination {DEST_SPLIT} already exists. Cleaning up before recreation...")
        shutil.rmtree(DEST_SPLIT)

    print(f"Cloning {SRC_SPLIT} -> {DEST_SPLIT}...")
    shutil.copytree(SRC_SPLIT, DEST_SPLIT)
    print("Clone complete.")

    corrections = collect_corrections()
    print(f"Found {len(corrections)} total corrections to apply across splits.")

    applied_corrections = []

    for item in corrections:
        fn = item["filename"]
        split = item["split"]
        orig_cls = item["original_class"]
        corr_cls = item["corrected_class"]

        if corr_cls not in VALID_CLASSES:
            raise ValueError(f"Invalid target class: {corr_cls}")

        src_file = DEST_SPLIT / split / orig_cls / fn
        dest_dir = DEST_SPLIT / split / corr_cls
        dest_file = dest_dir / fn

        if not src_file.exists():
            raise FileNotFoundError(f"Expected source file not found: {src_file}")

        dest_dir.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src_file), str(dest_file))
        applied_corrections.append(item)
        print(f"  [{split}] {fn}: {orig_cls} -> {corr_cls}")

    # Write audit log CSV
    with open(LOG_CSV, "w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "filename",
            "split",
            "source_review",
            "original_class",
            "corrected_class",
            "reason",
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(applied_corrections)

    print(f"\nCorrections log saved to {LOG_CSV}")

    # Display dataset statistics for split_v2 vs split_v3
    print("\n" + "=" * 60)
    print("DATASET COMPARISON: split_v2 (Original) vs split_v3 (Corrected)")
    print("=" * 60)

    for split in ["train", "validation", "test"]:
        print(f"\n--- {split.upper()} SPLIT ---")
        v2_total = 0
        v3_total = 0
        for cls in sorted(VALID_CLASSES):
            v2_cnt = len(list((SRC_SPLIT / split / cls).glob("*.*")))
            v3_cnt = len(list((DEST_SPLIT / split / cls).glob("*.*")))
            v2_total += v2_cnt
            v3_total += v3_cnt
            diff = v3_cnt - v2_cnt
            diff_str = f"({diff:+d})" if diff != 0 else ""
            print(f"  {cls:20s}: split_v2 = {v2_cnt:4d} | split_v3 = {v3_cnt:4d} {diff_str}")
        print(f"  {'TOTAL':20s}: split_v2 = {v2_total:4d} | split_v3 = {v3_total:4d}")


if __name__ == "__main__":
    main()
