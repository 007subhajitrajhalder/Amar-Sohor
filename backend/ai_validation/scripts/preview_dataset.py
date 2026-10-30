
from pathlib import Path
import random
from PIL import Image, ImageDraw

AI_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = AI_DIR / "raw" / "overflowing_dustbin"
OUTPUT_FILE = AI_DIR / "overflowing_preview.jpg"

extensions = {".jpg", ".jpeg", ".png", ".webp"}

files = [
    p for p in IMAGE_DIR.rglob("*")
    if p.is_file() and p.suffix.lower() in extensions
]

if not files:
    raise SystemExit(f"No images found in {IMAGE_DIR}")

random.seed(42)
sample = random.sample(files, min(40, len(files)))

columns = 5
cell_width = 180
cell_height = 150
label_height = 28
rows = (len(sample) + columns - 1) // columns

sheet = Image.new(
    "RGB",
    (columns * cell_width, rows * (cell_height + label_height)),
    "white"
)
draw = ImageDraw.Draw(sheet)

for i, path in enumerate(sample):
    try:
        with Image.open(path) as img:
            img = img.convert("RGB")
            img.thumbnail((cell_width - 10, cell_height - 10))

            x = (i % columns) * cell_width
            y = (i // columns) * (cell_height + label_height)

            sheet.paste(img, (x + 5, y + 5))
            draw.text(
                (x + 5, y + cell_height + 2),
                path.name[:24],
                fill="black"
            )
    except Exception as exc:
        print(f"Could not preview {path.name}: {exc}")

sheet.save(OUTPUT_FILE, quality=90)
print(f"Preview created: {OUTPUT_FILE}")
print(f"Images included: {len(sample)}")
