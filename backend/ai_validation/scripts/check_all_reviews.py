import csv
from pathlib import Path

csv_path = Path('backend/ai_validation/reports/misclassified_images_reviewed.csv')
with open(csv_path, 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Total rows in test set review: {len(rows)}")
decisions = {}
for r in rows:
    dec = r.get('review_decision', '')
    decisions[dec] = decisions.get(dec, 0) + 1
print("Decisions breakdown:", decisions)

corrected = [r for r in rows if r.get('review_decision') == 'correct_label']
print(f"\nTotal relabeled test items ({len(corrected)}):")
for r in corrected:
    print(f"  {r['filename']}: {r['actual']} -> {r['correct_label']} | {r['reason']}")
