# AI validation and image verification guide

Amar Sohor integrates deep-learning computer vision models (MobileNetV3) to
automate and assist civic grievance management, maintain photo authenticity,
and prevent fraud across municipal facilities.

## Active facility categories

AI image validation and resolution verification are actively enforced for four
major public facility categories:

- **Dustbin / Waste Bin** (`DUSTBIN`): Identifies normal bins, overflowing bins,
  damaged bins, unhygienic waste accumulation, and irrelevant images.
- **Public Toilet / Restroom** (`TOILET`): Identifies clean toilets/urinals,
  dirty toilets/urinals, broken sanitary infrastructure, and irrelevant images.
- **Drinking Water Point** (`WATER_POINT`): Identifies functional drinking water
  points, dirty taps/surroundings, broken taps/pipes, visible water leakage,
  damaged infrastructure stands, and irrelevant images.
- **Parking Spot / Zone** (`PARKING`): Identifies valid organized public parking,
  illegal parking, blocked parking spaces, damaged parking barriers/signs, poor
  parking management, pavement safety hazards, and irrelevant images.

---

## Citizen report validation workflow

When a citizen uploads a photograph while reporting an issue:

1. **Irrelevant image rejection**: The AI classifier immediately rejects photos
   identified as `irrelevant_image` (e.g., indoor selfies, unrelated household
   items, pets, documents, or scenery). The citizen is prompted to upload a
   genuine photo of the facility.
2. **Defect and operational facility acceptance**: Photographs showing valid
   facilities (whether displaying a severe defect or appearing clean/functional)
   are accepted so that municipal agencies can perform authoritative on-site
   assessments.
3. **AI validation score in investigation notes**: The model computes an
   assessment label and a confidence score (e.g., *overflowing_bin 88.5%
   confidence*, or *broken_drinking_water_facility 74.2% confidence*), which is
   automatically logged in the report's `investigation_notes` to guide agency
   field officers.

---

## Agency resolution evidence verification

When an agency officer submits an after-repair resolution photograph:

1. **Anti-duplicate verification (Fraud prevention)**: The system extracts deep
   structural feature vectors and compares the after-repair photo against the
   citizen's initial complaint photo. If similarity is 98.5% or higher, the
   submission is rejected as a fraudulent re-upload of the complaint photo.
2. **Scene & background consistency matching**: The system verifies that the
   background scene, wall textures, pavement, and structural landmarks match the
   reported site (requiring a deep feature similarity of at least 35%). Photos
   taken at an entirely different location or downloaded from the internet are
   rejected.
3. **Relevance check**: The resolution photograph must depict a genuine,
   relevant facility and cannot be an irrelevant image.
4. **Resolution audit notes**: Upon passing, the AI assessment, cleanliness
   confidence percentage, and background match score are recorded in the
   resolution description and investigation notes for administrative audit.

---

## Agency report rejection rules (50% AI threshold)

An agency member has the authority to outright reject a report from the
investigation page under strict compliance rules:

- **AI defect score below 50% or Good Facility**: If the citizen complaint was
  classified with an AI confidence below 50%, or if the facility was identified
  as operational/clean (e.g., `normal_bin`, `clean_public_toilet`,
  `functional_drinking_water`, `valid_public_parking`), the agency member can
  reject the report with an administrative explanation. The original citizen
  photo is archived as proof.
- **AI-verified defect with 50% or higher confidence**: If the AI model
  confirmed a facility defect with 50% or greater confidence, the agency officer
  cannot reject the ticket with a text excuse alone. An on-site inspection proof
  photograph is mandatory, and this proof photo is verified by the AI engine for
  relevance and background scene consistency.
- **Anti-spam cooldown**: Once a report is rejected, reporting on that facility
  is locked for 24 hours to prevent ticket flooding. Agency officers retain the
  authority to reopen rejected cases if necessary.
