
import torch

from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)

# 1. Use the CPU for model loading and testing.
device = torch.device("cpu")

# 2. Select the pretrained weights.
weights = MobileNet_V3_Large_Weights.DEFAULT

# 3. Create the model and load the pretrained weights.
model = mobilenet_v3_large(weights=weights)

# 4. Set the model to evaluation mode.
model.eval()

# 5. Display basic model information.
print("MobileNetV3-Large loaded successfully!")
print("PyTorch version:", torch.__version__)
print("Device:", device)
print("Model type:", type(model).__name__)

# 6. Display the model's final classification layers.
print("\nOriginal classifier:")
print(model.classifier)

# 7. Count the model's parameters.
total_parameters = sum(
    parameter.numel()
    for parameter in model.parameters()
)

print("\nTotal parameters:", total_parameters)

# 8. Get the correct image preprocessing steps.
preprocess = weights.transforms()

print("\nPreprocessing configuration:")
print(preprocess)
