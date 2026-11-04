
import torch
import torchvision

print("PyTorch version:", torch.__version__)
print("TorchVision version:", torchvision.__version__)

# Check whether a CUDA-compatible GPU is available.
print("CUDA available:", torch.cuda.is_available())

# Our project will run on the CPU.
device = torch.device("cpu")
print("Selected device:", device)

# Create a small tensor (a multidimensional numerical array).
numbers = torch.tensor([1.0, 2.0, 3.0])

# Perform a simple calculation.
result = numbers * 2

print("Original tensor:", numbers)
print("After multiplication:", result)
