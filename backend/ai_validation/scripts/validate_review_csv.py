
from pathlib import Path
import csv
from collections import Counter

# Locate the project directories from this script's location.
SCRIPT_DIR = Path(__file__).resolve().parent
AI_DIR = SCRIPT_DIR.parent
REPORT_DIR = AI_DIR / "reports"

CSV_PATH = REPORT_DIR / "misclassified_images_reviewed.csv"

# These are the four classes currently used by the model.
VALID_CLASSES = {
    "broken_bin",
    "irrelevant_image",
    "normal_bin",
    "overflowing_dustbin",
}

VALID_DECISIONS = {
    "keep_label",
    "correct_label",
    "uncertain",
    "exclude_from_task",
}

REQUIRED_COLUMNS = {
    "filename",
    "actual",
    "predicted",
    "confidence",
    "image_path",
    "review_decision",
    "correct_label",
    "reason",
    "review_status",
}


def main():
    # Stop early if the expected CSV doesn't exist.
    if not CSV_PATH.exists():
        print("ERROR: Reviewed CSV was not found:")
        print(CSV_PATH)
        return

    # Read the CSV using its column headers.
    with open(
        CSV_PATH,
        "r",
        newline="",
        encoding="utf-8-sig"
    ) as file:
        reader = csv.DictReader(file)

        # Check whether all required columns exist.
        missing_columns = REQUIRED_COLUMNS - set(
            reader.fieldnames or []
        )

        if missing_columns:
            print("ERROR: Missing columns:", sorted(missing_columns))
            return

        rows = list(reader)

    print("Rows found:", len(rows))

    # Count review decisions and collect validation problems.
    decision_counts = Counter()
    errors = []

    seen_filenames = set()

    for row_number, row in enumerate(rows, start=2):
        filename = row["filename"].strip()
        actual = row["actual"].strip()
        decision = row["review_decision"].strip()
        correct = row["correct_label"].strip()
        status = row["review_status"].strip()

        decision_counts[decision] += 1

        # Check for duplicate filenames.
        if filename in seen_filenames:
            errors.append(
                f"Row {row_number}: duplicate filename {filename}"
            )
        seen_filenames.add(filename)

        # Validate the original class label.
        if actual not in VALID_CLASSES:
            errors.append(
                f"Row {row_number}: invalid actual label {actual}"
            )

        # Validate the review decision.
        if decision not in VALID_DECISIONS:
            errors.append(
                f"Row {row_number}: invalid decision {decision}"
            )

        # A corrected label must be a known class.
        if decision == "correct_label":
            if correct not in VALID_CLASSES:
                errors.append(
                    f"Row {row_number}: missing or invalid corrected label"
                )
            elif correct == actual:
                errors.append(
                    f"Row {row_number}: correction matches original label"
                )

        # For kept labels, the reviewed class should match actual.
        if decision == "keep_label" and correct != actual:
            errors.append(
                f"Row {row_number}: keep_label but correct_label differs"
            )

        # Uncertain labels should remain blank.
        if decision == "uncertain" and correct:
            errors.append(
                f"Row {row_number}: uncertain row has a corrected label"
            )

        # Every reviewed row should have a reason.
        if not row["reason"].strip():
            errors.append(
                f"Row {row_number}: review reason is blank"
            )

        if status != "reviewed":
            print(
                f"NOTICE: Row {row_number} status is {status!r}"
            )

    print("\nDecision counts:")
    for decision, count in sorted(decision_counts.items()):
        print(f"  {decision}: {count}")

    print("\nValidation errors:", len(errors))

    for error in errors:
        print("  -", error)

    if not errors:
        print("\nCSV format and label consistency checks passed.")
        print("This does not independently verify image labels.")


if __name__ == "__main__":
    main()
