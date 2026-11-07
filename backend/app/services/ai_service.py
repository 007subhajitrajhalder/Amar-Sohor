import io
from pathlib import Path

import torch
from torch import nn
from PIL import Image, UnidentifiedImageError
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

# -----------------------------------------
# 1. Configuration and globals
# -----------------------------------------

DEVICE = torch.device("cpu")
MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "ai_validation"
    / "models"
    / "mobilenetv3_amar_sohor_v2.pth"
)

_model = None
_transform = None
_class_names = None


# -----------------------------------------
# 2. Load the trained model
# -----------------------------------------

def load_model():
    global _model, _transform, _class_names

    if _model is not None:
        return _model, _transform, _class_names

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    weights = MobileNet_V3_Large_Weights.DEFAULT
    _transform = weights.transforms()

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
        weights_only=True,
    )

    _class_names = checkpoint["class_names"]

    model = mobilenet_v3_large(weights=None)
    input_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(
        input_features,
        len(_class_names),
    )
    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    _model = model

    print("Amar Sohor Model V2 loaded successfully.")
    print("Model epoch:", checkpoint["epoch"])
    print(
        "Validation accuracy:",
        f"{checkpoint['validation_accuracy']:.2%}"
    )

    return _model, _transform, _class_names


# -----------------------------------------
# 3. Classify an uploaded image
# -----------------------------------------

def classify_image(image_bytes: bytes):
    model, transform, class_names = load_model()
    try:
        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Invalid image file") from exc

    image_tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        outputs = model(image_tensor.to(DEVICE))
        probabilities = torch.softmax(
            outputs,
            dim=1
        )[0]
        confidence, predicted_index = torch.max(
            probabilities,
            dim=0
        )

    predicted_class = class_names[predicted_index.item()]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence.item(), 4),
        "is_relevant": predicted_class != "irrelevant_image",
    }
