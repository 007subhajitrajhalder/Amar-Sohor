# Project overview

Amar Sohor is a GIS-integrated smart city civic platform designed for Kolkata to
bridge the gap between citizens, municipal field agencies, and city
administrators. The platform empowers citizens to discover public facilities,
report maintenance and sanitation problems with verified photographic evidence,
and propose new civic infrastructure in under-served neighborhoods.

---

## Core pillars of Amar Sohor

The platform is structured around four primary architectural pillars:

1. **Interactive GIS Smart City Facility Map**:
   - Public map displaying dustbins, public restrooms, drinking water taps, and
     public parking zones with their current operational statuses
     (`OPEN`, `UNDER_REPAIR`, `SUSPENDED`).
   - Facility details may also display a summary of an active report or a recent
     rejection.
2. **Deep-Learning AI Validation Engine**:
   - Custom MobileNetV3 computer vision classifiers deployed across all four
     facility domains.
   - Automatically filters out irrelevant or spam images during citizen
     reporting.
   - Calculates objective condition scores and defect labels logged in
     investigation notes to assist field officers.
   - Performs anti-fraud duplicate detection (>= 98.5% similarity) and deep scene
     background consistency verification (>= 35% spatial geometry match) on
     after-repair resolution photos.
3. **Evidence-Based Complaint Redressal & Agency Portal**:
   - Structured grievance lifecycle (`PENDING` -> `UNDER_INVESTIGATION` ->
     `RESOLVED` / `REJECTED`).
   - Anti-flooding safeguards: single active report per facility, hourly rate
     limits, and a 24-hour rejection cooldown.
   - Fair rejection governance: grievances with AI-confirmed defects (>= 50%
     confidence) cannot be dismissed without an on-site inspection proof photo
     verified by AI.
4. **Community-Driven Facility Recommendations**:
   - Empowers citizens to advocate for new infrastructure where none exists.
   - Multi-tier governance: citizen submission -> administrator allocation ->
     agency field feasibility study -> approval, technical rejection, or
     installation.

---

## Platform roles and portals

- **Citizen (`USER`)**: Discovers facilities on the map, reports civic issues
  with photo verification, tracks complaints, and submits new facility
  recommendations.
- **Agency Member (`AGENT`)**: Manages physical facilities for their assigned
  municipal agency, inspects grievances, submits verified resolution evidence,
  and conducts recommendation feasibility studies.
- **Municipal Administrator (`ADMIN`)**: Platform-wide oversight of agencies,
  personnel rosters, global complaints, and recommendation allocation.

---

## Static information notice for this assistant

This assistant uses static project reference documentation and can answer
aggregate facility-count questions from a read-only query of public facility
records. It does not access active report tickets, citizen accounts, or
facility-by-facility availability. It cannot look up a user's complaint status
or make administrative changes. Direct users to the relevant citizen, agency,
or admin portal for live actions.
