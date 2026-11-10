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


# -----------------------------------------
# 4. Deep Feature Extraction & Similarity
# -----------------------------------------

def extract_feature_vector(image_bytes: bytes, facility_type: str = "dustbin") -> torch.Tensor:
    """
    Extracts L2-normalized deep visual features from MobileNetV3 backbone.
    Normalized pooled features (960-dim) capture environmental geometry and textures
    while cancelling out uniform lighting / day-night brightness differences.
    """
    model, transform, _ = load_model(facility_type)
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Invalid image file") from exc

    tensor = transform(image).unsqueeze(0).to(DEVICE)
    with torch.inference_mode():
        features = model.features(tensor)
        pooled = model.avgpool(features)
        flattened = torch.flatten(pooled, 1)
        normalized = torch.nn.functional.normalize(flattened, p=2, dim=1)
    return normalized


def compute_cosine_similarity(feat1: torch.Tensor, feat2: torch.Tensor) -> float:
    """Computes cosine similarity between two unit-normalized feature tensors."""
    sim = torch.sum(feat1 * feat2, dim=1).item()
    # Clamp between -1.0 and 1.0 for numerical safety
    return float(max(-1.0, min(1.0, sim)))


# -----------------------------------------
# 5. Report Resolution AI Verification
# -----------------------------------------

def verify_resolution_evidence(
    after_bytes: bytes,
    before_bytes: Optional[bytes] = None,
    facility_type: str = "dustbin"
) -> dict:
    """
    Validates after-repair evidence submitted by agency members:
    1. Anti-Duplicate Check: Flags fraudulent re-upload of the original complaint photo.
    2. Facility Cleanliness/Repair Check: Requires the facility to be clean/functional.
    3. Scene Consistency Check: Compares deep feature embeddings to verify physical location match,
       calibrated to tolerate day-night and angle variations.
    """
    is_toilet = any(k in facility_type.lower() for k in ["toilet", "washroom", "restroom", "urinal"])
    norm_type = "toilet" if is_toilet else "dustbin"

    # Step 1: Cleanliness / Repair classification on the after-repair photo
    if is_toilet:
        clf_result = classify_toilet_image(after_bytes)
        pred_class = clf_result["predicted_class"]
        conf = clf_result["confidence"]

        clean_classes = {"clean_public_toilet", "clean_public_urinal"}
        issue_labels = {
            "dirty_public_toilet": "Dirty Public Toilet",
            "dirty_public_urinal": "Dirty Public Urinal",
            "broken_public_toilet": "Broken Public Toilet",
            "broken_public_urinal": "Broken Public Urinal",
        }
        is_clean = pred_class in clean_classes
    else:
        clf_result = classify_dustbin_image(after_bytes)
        pred_class = clf_result["predicted_class"]
        conf = clf_result["confidence"]

        clean_classes = {"normal_bin"}
        issue_labels = {
            "overflowing_dustbin": "Overflowing Dustbin",
            "broken_bin": "Broken / Damaged Bin",
        }
        is_clean = pred_class in clean_classes

    # Step 2: Compare with before-repair complaint photo if provided
    similarity: Optional[float] = None
    is_duplicate = False
    scene_matched = True
    audit_note = ""

    if before_bytes:
        try:
            feat_after = extract_feature_vector(after_bytes, norm_type)
            feat_before = extract_feature_vector(before_bytes, norm_type)
            similarity = compute_cosine_similarity(feat_before, feat_after)

            # Check 1: Anti-duplication (Exact or near-exact duplicate of citizen photo)
            if similarity >= 0.985:
                is_duplicate = True
                return {
                    "status": "REJECTED",
                    "facility_type": norm_type,
                    "predicted_class": pred_class,
                    "cleanliness_confidence": conf,
                    "scene_similarity": round(similarity, 4),
                    "is_duplicate": True,
                    "scene_matched": True,
                    "message": (
                        f"Resolution Rejected: Duplicate photograph detected ({similarity * 100:.1f}% identity). "
                        "The resolution photograph appears identical to the original complaint photograph. "
                        "Please upload genuine photographic proof of the completed repair work."
                    ),
                    "audit_note": f"Fraud warning: Duplicate image uploaded. Similarity: {similarity * 100:.2f}%."
                }

            # Check 2: Scene consistency (Threshold: >= 0.35)
            # Calibrated deep cosine threshold: structural gradients and tile/bin geometry
            if similarity < 0.35:
                scene_matched = False

        except Exception as exc:
            logger.warning("Feature comparison failed, falling back to classifier: %s", exc)
            similarity = None

    # Step 3: Evaluate Cleanliness & Scene Match
    if not is_clean:
        if pred_class == "irrelevant_image":
            message = (
                f"Resolution Rejected: The uploaded photo does not appear to show a valid {norm_type} facility "
                f"({conf * 100:.1f}% confidence). Please upload a clear photo of the restored facility."
            )
        else:
            label = issue_labels.get(pred_class, pred_class.replace("_", " ").title())
            message = (
                f"Resolution Rejected: The resolution photo still shows a civic issue ({label}, {conf * 100:.1f}% confidence). "
                "Evidence must confirm that the facility has been cleaned, emptied, or repaired."
            )
        return {
            "status": "REJECTED",
            "facility_type": norm_type,
            "predicted_class": pred_class,
            "cleanliness_confidence": conf,
            "scene_similarity": round(similarity, 4) if similarity is not None else None,
            "is_duplicate": is_duplicate,
            "scene_matched": scene_matched,
            "message": message,
            "audit_note": f"Rejected by cleanliness classifier: {pred_class} ({conf * 100:.1f}%)."
        }

    # Cleanliness passed! Now evaluate scene consistency if before photo was checked
    if before_bytes and similarity is not None:
        if scene_matched:
            # Both clean and scene match >= 0.35
            return {
                "status": "ACCEPTED",
                "facility_type": norm_type,
                "predicted_class": pred_class,
                "cleanliness_confidence": conf,
                "scene_similarity": round(similarity, 4),
                "is_duplicate": False,
                "scene_matched": True,
                "message": (
                    f"Valid Resolution: Clean facility verified ({conf * 100:.1f}%) and "
                    f"location match confirmed ({similarity * 100:.1f}% scene consistency)."
                ),
                "audit_note": f"Verified clean ({pred_class}) with verified site scene match ({similarity * 100:.1f}%)."
            }
        else:
            # Low scene similarity (< 0.35).
            # If cleanliness confidence is high (>= 0.85), allow with day/night/angle advisory
            if conf >= 0.85:
                return {
                    "status": "ACCEPTED",
                    "facility_type": norm_type,
                    "predicted_class": pred_class,
                    "cleanliness_confidence": conf,
                    "scene_similarity": round(similarity, 4),
                    "is_duplicate": False,
                    "scene_matched": False,
                    "message": (
                        f"Valid Resolution: Clean facility confirmed ({conf * 100:.1f}%). "
                        f"Note: Lighting or perspective shift detected ({similarity * 100:.1f}% scene similarity)."
                    ),
                    "audit_note": (
                        f"Accepted with notice: Cleanliness {conf * 100:.1f}% ({pred_class}). "
                        f"Low scene match ({similarity * 100:.1f}%) attributed to illumination/angle change."
                    )
                }
            else:
                return {
                    "status": "REJECTED",
                    "facility_type": norm_type,
                    "predicted_class": pred_class,
                    "cleanliness_confidence": conf,
                    "scene_similarity": round(similarity, 4),
                    "is_duplicate": False,
                    "scene_matched": False,
                    "message": (
                        f"Resolution Rejected: The resolution photo does not sufficiently match the facility location "
                        f"from the original complaint ({similarity * 100:.1f}% scene match). "
                        "Please ensure the photograph is taken at the exact reported location."
                    ),
                    "audit_note": f"Rejected: Low scene match ({similarity * 100:.1f}%) and moderate cleanliness confidence ({conf * 100:.1f}%)."
                }

    # Before photo was not available, but after photo is clean
    return {
        "status": "ACCEPTED",
        "facility_type": norm_type,
        "predicted_class": pred_class,
        "cleanliness_confidence": conf,
        "scene_similarity": None,
        "is_duplicate": False,
        "scene_matched": True,
        "message": f"Valid Resolution: Clean facility verified ({conf * 100:.1f}% confidence).",
        "audit_note": f"Verified clean ({pred_class}). No complaint photo was available for comparison."
    }

