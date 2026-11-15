# Civic complaint and resolution workflow

This document outlines the end-to-end lifecycle, verification standards, and
governance rules governing citizen complaints in Amar Sohor.

## Complete report lifecycle

A civic grievance follows a standardized administrative lifecycle:

1. **`PENDING`**: The citizen has submitted a complaint with a verified photo.
   The ticket is routed to the specialized municipal agency responsible for that
   facility category.
2. **`UNDER_INVESTIGATION`**: An authorized agency field officer accepts the
   ticket and initiates on-site inspection.
3. **`RESOLVED`**: Maintenance, cleaning, or repair has been performed on-site.
   The agency officer has submitted a resolution description, completion date,
   and an after-repair resolution photo that successfully passed AI scene and
   cleanliness verification.
4. **`REJECTED`**: The agency officer determined the grievance to be invalid,
   unfounded, or spam under strict compliance criteria. Once rejected, the case
   is archived in Previously Solved/Rejected Reports, and a 24-hour reporting
   cooldown is placed on the facility.
5. **Reopened**: Agency officers possess administrative authority to reopen a
   rejected report if citizen feedback or new evidence indicates the issue
   persists.

---

## Submission gates and anti-spam controls

To prevent ticket spam, bot floods, and redundant alerts, the platform enforces
four mandatory submission barriers:

- **Facility status lock**: Facilities marked as `UNDER_REPAIR` (crews already on
  site) or `SUSPENDED` (offline) cannot accept new complaints.
- **Active report lock**: Only one active grievance (`PENDING` or
  `UNDER_INVESTIGATION`) can exist for a facility at any time. Citizens are
  directed to view the existing active report.
- **Hourly rate limit**: A citizen user account cannot lodge more than 5 reports
  within any 60-minute window.
- **24-hour rejection cooldown**: When an agency rejects a report on a facility,
  new complaint submissions for that specific facility are blocked for 24 hours
  to prevent retaliatory spamming.

---

## AI-assisted image validation standards

The backend applies MobileNetV3 deep learning classifiers and feature vector
comparisons:

1. **Citizen reporting pre-screening**:
   - Rejects `irrelevant_image` submissions immediately.
   - Accepts both valid civic defects and functional facilities.
   - Automatically computes a confidence score and assessment label, saving it
     into the report's `investigation_notes`.
2. **Agency resolution verification**:
   - **Anti-duplicate defense**: Rejects resolution photos having >= 98.5%
     structural similarity to the initial complaint photo (preventing
     fraudulent reuse of the citizen's photo).
   - **Scene & background matching**: Verifies that deep spatial feature
     vectors of the background scene, pavement, walls, and surroundings match the
     reported site (similarity >= 35%).
   - **Relevance check**: Ensures the resolution image depicts the genuine
     facility.
   - Logs verified audit notes into the resolution description.

---

## Agency rejection rules (50% AI threshold)

To safeguard citizens against unfair dismissals while giving agencies legitimate
discretion:

- **AI defect score below 50% or Good Facility**: If the AI classified the
  facility as clean/operational, or if the defect confidence is below 50%, the
  agency member can reject the report with a written reason.
- **AI-confirmed defect with 50% or higher confidence**: The agency member
  **cannot** reject with a text excuse alone. An on-site inspection proof
  photograph is mandatory and must pass AI relevance and scene consistency
  verification.
