
from pathlib import Path
import csv
from collections import Counter

SCRIPT_DIR = Path(__file__).resolve().parent
REPORT_DIR = SCRIPT_DIR.parent / "reports"
CSV_PATH = REPORT_DIR / "misclassified_images_reviewed.csv"


def main():
    # Store counts for each original-to-corrected class change.
    corrections = Counter()

    with open(
        CSV_PATH,
        "r",
        newline="",
        encoding="utf-8-sig"
    ) as file:
        reader = csv.DictReader(file)

        for row in reader:
            if row["review_decision"].strip() == "correct_label":
                original = row["actual"].strip()
                corrected = row["correct_label"].strip()

                corrections[(original, corrected)] += 1

    print("PROPOSED LABEL CORRECTIONS")
    print("=" * 50)

    if not corrections:
        print("No proposed corrections found.")
        return

    for (original, corrected), count in sorted(corrections.items()):
        print(f"{original} -> {corrected}: {count}")

    print("\nTotal proposed corrections:", sum(corrections.values()))


if __name__ == "__main__":
    main()
