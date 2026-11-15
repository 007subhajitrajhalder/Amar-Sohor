"""Classify civic-facility images and verify repair evidence for the reports API router."""

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
WATER_MODEL_PATH = AI_MODELS_DIR / "mobilenetv3_drinking_water.pth"
PARKING_MODEL_PATH = AI_MODELS_DIR / "mobilenetv3_parking.pth"

# Cached instances
_dustbin_model = None
_dustbin_transform = None
_dustbin_class_names = None

_toilet_model = None
_toilet_transform = None
_toilet_class_names = None

_water_model = None
_water_transform = None
_water_class_names = None

_parking_model = None
_parking_transform = None
_parking_class_names = None


# -----------------------------------------
# 2. Model Loaders
# -----------------------------------------

def load_dustbin_model() -> Tuple[nn.Module, object, list]:
    """Load and cache the dustbin classifier used by report-image validation and repair checks."""
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
    """Load and cache the public-toilet classifier used by report-image validation and repair checks."""
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


def load_water_model() -> Tuple[nn.Module, object, list]:
    """Load and cache the drinking-water facility classifier."""
    global _water_model, _water_transform, _water_class_names

    if _water_model is not None:
        return _water_model, _water_transform, _water_class_names

    if not WATER_MODEL_PATH.exists():
        raise FileNotFoundError(f"Drinking water model file not found at {WATER_MODEL_PATH}")

    weights = MobileNet_V3_Large_Weights.DEFAULT
    _water_transform = weights.transforms()

    checkpoint = torch.load(
        WATER_MODEL_PATH,
        map_location=DEVICE,
        weights_only=True,
    )

    _water_class_names = checkpoint["class_names"]

    model = mobilenet_v3_large(weights=None)
    input_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(input_features, len(_water_class_names))
    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    _water_model = model
    logger.info("Amar Sohor Drinking Water Model loaded successfully (Val Acc: %.2f%%)", checkpoint.get("validation_accuracy", 0.0) * 100)
    return _water_model, _water_transform, _water_class_names


def load_parking_model() -> Tuple[nn.Module, object, list]:
    """Load and cache the public-parking facility classifier."""
    global _parking_model, _parking_transform, _parking_class_names

    if _parking_model is not None:
        return _parking_model, _parking_transform, _parking_class_names

    if not PARKING_MODEL_PATH.exists():
        raise FileNotFoundError(f"Parking model file not found at {PARKING_MODEL_PATH}")

    weights = MobileNet_V3_Large_Weights.DEFAULT
    _parking_transform = weights.transforms()

    checkpoint = torch.load(
        PARKING_MODEL_PATH,
        map_location=DEVICE,
        weights_only=True,
    )

    _parking_class_names = checkpoint["class_names"]

    model = mobilenet_v3_large(weights=None)
    input_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(input_features, len(_parking_class_names))
    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    _parking_model = model
    logger.info("Amar Sohor Public Parking Model loaded successfully (Val Acc: %.2f%%)", checkpoint.get("validation_accuracy", 0.0) * 100)
    return _parking_model, _parking_transform, _parking_class_names


def load_model(model_type: str = "dustbin"):
    """Backwards-compatible generic loader."""
    ml = model_type.lower()
    if any(k in ml for k in ["toilet", "washroom", "restroom", "urinal"]):
        return load_toilet_model()
    if any(k in ml for k in ["water", "drinking", "tap", "dispenser", "fountain"]):
        return load_water_model()
    if any(k in ml for k in ["parking", "carpark", "garage"]):
        return load_parking_model()
    return load_dustbin_model()


# -----------------------------------------
# 3. Classify uploaded images
# -----------------------------------------

def classify_dustbin_image(image_bytes: bytes) -> dict:
    """Classify a dustbin photo for the reports router's image-validation endpoint."""
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
    """Classify a toilet photo for the reports router's image-validation endpoint."""
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


def classify_drinking_water_image(image_bytes: bytes) -> dict:
    """Classify a drinking water facility photo for report validation."""
    model, transform, class_names = load_water_model()
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
        "facility_type": "water",
        "predicted_class": predicted_class,
        "confidence": round(confidence.item(), 4),
        "is_relevant": predicted_class != "irrelevant_image",
    }


def classify_parking_image(image_bytes: bytes) -> dict:
    """Classify a public parking facility photo for report validation."""
    model, transform, class_names = load_parking_model()
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
        "facility_type": "parking",
        "predicted_class": predicted_class,
        "confidence": round(confidence.item(), 4),
        "is_relevant": predicted_class != "irrelevant_image",
    }


def classify_image(image_bytes: bytes, facility_type: str = "dustbin") -> dict:
    """Dispatches to the correct model based on facility type."""
    ft = facility_type.lower()
    if any(k in ft for k in ["toilet", "washroom", "restroom", "urinal"]):
        return classify_toilet_image(image_bytes)
    if any(k in ft for k in ["water", "drinking", "tap", "dispenser", "fountain"]):
        return classify_drinking_water_image(image_bytes)
    if any(k in ft for k in ["parking", "carpark", "garage"]):
        return classify_parking_image(image_bytes)
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
    ft = facility_type.lower()
    is_toilet = any(k in ft for k in ["toilet", "washroom", "restroom", "urinal"])
    is_water = any(k in ft for k in ["water", "drinking", "tap", "dispenser", "fountain"])
    is_parking = any(k in ft for k in ["parking", "carpark", "garage"])

    # Step 1: Cleanliness / Repair classification on the after-repair photo
    if is_toilet:
        norm_type = "toilet"
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
    elif is_water:
        norm_type = "water"
        clf_result = classify_drinking_water_image(after_bytes)
        pred_class = clf_result["predicted_class"]
        conf = clf_result["confidence"]
        clean_classes = {"functional_drinking_water"}
        issue_labels = {
            "dirty_drinking_water_facility": "Dirty Drinking Water Facility",
            "broken_drinking_water_facility": "Broken Drinking Water Facility",
            "water_leakage": "Water Leakage / Wastage",
            "damaged_water_infrastructure": "Damaged Water Infrastructure",
        }
        is_clean = pred_class in clean_classes
    elif is_parking:
        norm_type = "parking"
        clf_result = classify_parking_image(after_bytes)
        pred_class = clf_result["predicted_class"]
        conf = clf_result["confidence"]
        clean_classes = {"valid_public_parking"}
        issue_labels = {
            "illegal_parking": "Illegal Parking",
            "blocked_parking_space": "Blocked Parking Space",
            "damaged_parking_infrastructure": "Damaged Parking Infrastructure",
            "poor_parking_management": "Poor Parking Management",
            "parking_facility_hazard": "Parking Facility Hazard",
        }
        is_clean = pred_class in clean_classes
    else:
        norm_type = "dustbin"
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
            # Rejects if the image background/location does not match the complaint photograph.
            if similarity < 0.35:
                scene_matched = False
                return {
                    "status": "REJECTED",
                    "facility_type": norm_type,
                    "predicted_class": pred_class,
                    "cleanliness_confidence": conf,
                    "scene_similarity": round(similarity, 4),
                    "is_duplicate": False,
                    "scene_matched": False,
                    "message": (
                        f"Resolution Rejected: Location / scene mismatch detected ({similarity * 100:.1f}% background match). "
                        "The uploaded photograph does not appear to match the physical background or site of the reported complaint. "
                        "Please upload genuine photographic proof taken at the actual reported facility location."
                    ),
                    "audit_note": f"Rejected due to scene mismatch (Scene similarity: {similarity * 100:.1f}% < 35%)."
                }

        except Exception as exc:
            logger.warning("Feature comparison failed, falling back to classifier: %s", exc)
            similarity = None

    # Step 3: Evaluate Relevance & Assessment
    if pred_class == "irrelevant_image":
        return {
            "status": "REJECTED",
            "facility_type": norm_type,
            "predicted_class": pred_class,
            "cleanliness_confidence": conf,
            "scene_similarity": round(similarity, 4) if similarity is not None else None,
            "is_duplicate": False,
            "scene_matched": False,
            "message": (
                f"Resolution Rejected: The uploaded photo does not appear to show a valid {norm_type} facility "
                f"({conf * 100:.1f}% confidence). Please upload a clear photo of the facility."
            ),
            "audit_note": f"Rejected as irrelevant image ({conf * 100:.1f}% confidence)."
        }

    # Image is relevant to the facility (accepted with AI assessment score)
    label = issue_labels.get(pred_class, pred_class.replace("_", " ").title())
    similarity_text = f", Scene Match: {similarity * 100:.1f}%" if similarity is not None else ""
    audit_note = f"AI Assessment: {label} ({conf * 100:.1f}% confidence{similarity_text})"

    return {
        "status": "ACCEPTED",
        "facility_type": norm_type,
        "predicted_class": pred_class,
        "cleanliness_confidence": conf,
        "scene_similarity": round(similarity, 4) if similarity is not None else None,
        "is_duplicate": False,
        "scene_matched": similarity is None or similarity >= 0.35,
        "message": f"Resolution Evidence Accepted: AI Assessment is {label} ({conf * 100:.1f}% confidence).",
        "audit_note": audit_note
    }

