import csv

with open('backend/ai_validation/reports/training_audit.csv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Total rows: {len(rows)}")
for i, r in enumerate(rows):
    sheet = (i // 20) + 1
    sheet_idx = (i % 20) + 1
    print(f"Sheet {sheet} Item {sheet_idx:2d} (Global {i+1:3d}): actual={r['actual']:20s} filename={r['filename']}")
