
import torch
from torch import nn
from torchvision.models import (
    mobilenet_v3_large,
    MobileNet_V3_Large_Weights,
)


# 1. Use the CPU for model preparation and training.
device = torch.device("cpu")


# 2. Load MobileNetV3-Large with pretrained weights.
weights = MobileNet_V3_Large_Weights.DEFAULT
model = mobilenet_v3_large(weights=weights)


# 3. Freeze all existing model parameters.
for parameter in model.parameters():
    parameter.requires_grad = False


# 4. Replace the final layer with a four-class classifier.
input_features = model.classifier[3].in_features

model.classifier[3] = nn.Linear(
    input_features,
    4,
)


# 5. Allow the new final layer to learn.
for parameter in model.classifier[3].parameters():
    parameter.requires_grad = True


# 6. Move the model to the selected device.
model = model.to(device)


# 7. Display the model configuration.
print("Model prepared successfully!")
print("Device:", device)
print("Number of output classes:", model.classifier[3].out_features)

print("\nClass mapping:")
print("0 = broken_bin")
print("1 = irrelevant_image")
print("2 = normal_bin")
print("3 = overflowing_dustbin")


# 8. Count model parameters.
total_parameters = sum(
    parameter.numel()
    for parameter in model.parameters()
)

trainable_parameters = sum(
    parameter.numel()
    for parameter in model.parameters()
    if parameter.requires_grad
)

print("\nTotal parameters:", total_parameters)
print("Trainable parameters:", trainable_parameters)
print("Frozen parameters:", total_parameters - trainable_parameters)


# 9. Test the model with a batch of eight sample inputs.
model.eval()

sample_images = torch.randn(8, 3, 224, 224)

with torch.no_grad():
    outputs = model(sample_images)

print("\nTest input shape:", tuple(sample_images.shape))
print("Model output shape:", tuple(outputs.shape))
