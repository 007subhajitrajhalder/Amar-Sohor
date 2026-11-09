import io
import logging
from pathlib import Path
from typing import Optional, Tuple

import torch
from torch import nn
from PIL import Image, UnidentifiedImageError
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

logger = logging.getLogger(__name__)

# -----------------------------------------
# 1. Configuration and globals
# -----------------------------------------

DEVICE = torch.device("cpu")
AI_MODELS_DIR = Path(__file__).resolve().parents[2] / "ai_validation" / "models"
DUSTBIN_MODEL_PATH = AI_MODELS_DIR / "mobilenetv3_amar_sohor_v2.pth"
TOILET_MODEL_PATH = AI_MODELS_DIR / "mobilenetv3_toilets.pth"

# Cached instances
_dustbin_model = None
_dustbin_transform = None
_dustbin_class_names = None

_toilet_model = None
_toilet_transform = None
_toilet_class_names = None


# -----------------------------------------
# 2. Model Loaders
# -----------------------------------------

def load_dustbin_model() -> Tuple[nn.Module, object, list]:
    global _dustbin_model, _dustbin_transform, _dustbin_class_names

    if _dustbin_model is not None:
        return _dustbin_model, _dustbin_transform, _dustbin_class_names

    if not DUSTBIN_MODEL_PATH.exists():
        raise FileNotFoundError(f"Dustbin model file not found at {DUSTBIN_MODEL_PATH}")

    weights = MobileNet_V3_Large_Weights.DEFAULT
    _dustbin_transform = weights.transforms()

    checkpoint = torch.load(
        DUSTBIN_MODEL_PATH,
        map_location=DEVICE,
        weights_only=True,
    )

    _dustbin_class_names = checkpoint["class_names"]

    model = mobilenet_v3_large(weights=None)
    input_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(
        input_features,
        len(_dustbin_class_names),
    )
    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    _dustbin_model = model
    logger.info("Amar Sohor Dustbin Model loaded successfully (Val Acc: %.2f%%)", checkpoint.get("validation_accuracy", 0.0) * 100)
    return _dustbin_model, _dustbin_transform, _dustbin_class_names


def load_toilet_model() -> Tuple[nn.Module, object, list]:
    global _toilet_model, _toilet_transform, _toilet_class_names

    if _toilet_model is not None:
        return _toilet_model, _toilet_transform, _toilet_class_names

    if not TOILET_MODEL_PATH.exists():
        raise FileNotFoundError(f"Toilet model file not found at {TOILET_MODEL_PATH}")

    weights = MobileNet_V3_Large_Weights.DEFAULT
    _toilet_transform = weights.transforms()

    checkpoint = torch.load(
        TOILET_MODEL_PATH,
        map_location=DEVICE,
        weights_only=True,
    )

    _toilet_class_names = checkpoint["class_names"]

    model = mobilenet_v3_large(weights=None)
    input_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(
        input_features,
        len(_toilet_class_names),
    )
    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    _toilet_model = model
    logger.info("Amar Sohor Public Toilet Model loaded successfully (Val Acc: %.2f%%)", checkpoint.get("validation_accuracy", 0.0) * 100)
    return _toilet_model, _toilet_transform, _toilet_class_names


def load_model(model_type: str = "dustbin"):
    """Backwards-compatible generic loader."""
    if any(k in model_type.lower() for k in ["toilet", "washroom", "restroom", "urinal"]):
        return load_toilet_model()
    return load_dustbin_model()


# -----------------------------------------
# 3. Classify uploaded images
# -----------------------------------------

def classify_dustbin_image(image_bytes: bytes) -> dict:
    model, transform, class_names = load_dustbin_model()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Invalid image file") from exc

    image_tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        outputs = model(image_tensor.to(DEVICE))
        probabilities = torch.softmax(outputs, dim=1)[0]
        confidence, predicted_index = torch.max(probabilities, dim=0)

    predicted_class = class_names[predicted_index.item()]
    return {
        "facility_type": "dustbin",
        "predicted_class": predicted_class,
        "confidence": round(confidence.item(), 4),
        "is_relevant": predicted_class != "irrelevant_image",
    }


def classify_toilet_image(image_bytes: bytes) -> dict:
    model, transform, class_names = load_toilet_model()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Invalid image file") from exc

    image_tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        outputs = model(image_tensor.to(DEVICE))
        probabilities = torch.softmax(outputs, dim=1)[0]
        confidence, predicted_index = torch.max(probabilities, dim=0)

    predicted_class = class_names[predicted_index.item()]
    return {
        "facility_type": "toilet",
        "predicted_class": predicted_class,
        "confidence": round(confidence.item(), 4),
        "is_relevant": predicted_class != "irrelevant_image",
    }


def classify_image(image_bytes: bytes, facility_type: str = "dustbin") -> dict:
    """Dispatches to the correct model based on facility type."""
    if any(k in facility_type.lower() for k in ["toilet", "washroom", "restroom", "urinal"]):
        return classify_toilet_image(image_bytes)
    return classify_dustbin_image(image_bytes)
