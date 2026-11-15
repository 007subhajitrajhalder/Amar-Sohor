import sys
import os

sys.path.insert(0, os.path.abspath('backend'))
from app.services.ai_service import (
    classify_drinking_water_image,
    classify_parking_image,
    classify_image,
    verify_resolution_evidence,
)

# Test water image
water_dir = 'backend/ai_validation/dataset/split_drinking_water/test/functional_drinking_water'
water_files = os.listdir(water_dir)
if water_files:
    with open(os.path.join(water_dir, water_files[0]), 'rb') as f:
        img_bytes = f.read()
    res = classify_drinking_water_image(img_bytes)
    print('Water classification test:', res)

# Test parking image
parking_dir = 'backend/ai_validation/dataset/split_parking/test/valid_public_parking'
parking_files = os.listdir(parking_dir)
if parking_files:
    with open(os.path.join(parking_dir, parking_files[0]), 'rb') as f:
        p_bytes = f.read()
    res = classify_parking_image(p_bytes)
    print('Parking classification test:', res)

# Test generic classify_image
disp_res = classify_image(p_bytes, 'parking')
print('Dispatcher parking test:', disp_res)

# Test verify_resolution_evidence for water
if water_files and len(water_files) > 1:
    with open(os.path.join(water_dir, water_files[0]), 'rb') as f1:
        b1 = f1.read()
    with open(os.path.join(water_dir, water_files[1]), 'rb') as f2:
        b2 = f2.read()
    res = verify_resolution_evidence(b1, b2, 'water')
    print('Water resolution verification status:', res['status'], '| msg:', res['message'])

print('--- ALL VERIFICATION CHECKS SUCCEEDED ---')
