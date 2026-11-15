# Citizen user guide

## Exploring the smart city facility map

Citizens can discover public civic amenities across Kolkata using the interactive
map:

1. **How to open the map**:
   - **From the Home page**: Click the **Find Nearby** search button in the hero
     section, or click any of the quick category cards (**Dustbin**, **Public Toilet**,
     **Drinking Water**, or **Parking**).
   - **From your Citizen Dashboard**: Click the **Explore Map** button (with the map
     icon) in the top action bar.
2. **Filtering by category**: Use the category selector at the top of the map to
   switch between:
   - **Dustbin / Waste Bin** (`DUSTBIN`)
   - **Public Toilet / Restroom** (`TOILET`)
   - **Drinking Water Point** (`WATER_POINT`)
   - **Parking Spot / Zone** (`PARKING`)
3. **Viewing facility details**: Click on any facility card or marker on the map and
   select **View Details** to open its dedicated page, showing its street address,
   managing municipal agency, operational status, and community reviews.
4. **Checking operational status indicators**:
   - `OPEN`: Operational and available for public use.
   - `UNDER_REPAIR`: Marked when municipal maintenance crews are currently working
     on-site; new report submissions are temporarily paused.
   - `SUSPENDED`: Temporarily decommissioned.
   - Facility details may include a summary of an active report or a recent
     rejection, including its report number and status.

---

## Submitting a civic complaint

Citizens can lodge a grievance for unhygienic conditions, broken taps, or damaged bins:

1. **How to start a report**:
   - **Method 1 (From Home page)**: Scroll down to the *Citizen Issue Report* banner and
     click the green **Report an Issue** button.
   - **Method 2 (From Citizen Dashboard)**: Click the **Report an Issue** button
     (with the warning icon) in the top action bar.
   - **Method 3 (From Facility Details)**: On the interactive map, click on the specific
     facility and select the **Report Issue** button.
2. **Filling in details**:
   - Select or confirm the facility.
   - Enter a clear issue title and detailed description of the problem.
   - Upload a genuine photograph of the defective facility taken on-site.
3. **Real-time AI verification**:
   - The platform's MobileNetV3 deep learning module automatically screens the photo.
   - Unrelated images (household items, selfies, pets, or random scenery) are rejected
     instantly with an alert to attach a real photo of the facility.
   - Genuine photos (whether showing overflowing waste, a broken pipe, or an intact unit)
     are accepted, and an AI confidence score is logged to assist agency field officers.
4. **Submission rules & safeguards**:
   - **Single active report rule**: Only one active grievance (`PENDING` or
     `UNDER_INVESTIGATION`) can exist per facility at a time.
   - **Rate limit**: You can submit at most 5 reports per hour.
   - **24-hour rejection cooldown**: If an agency recently rejected a grievance on a
     facility, new submissions on that facility are paused for 24 hours to prevent spam.

---

## Tracking submitted complaints

To check the progress of your lodged grievances:

1. Open your **Citizen Dashboard** (accessible by clicking your name button in the top
   header when signed in).
2. Click the **View My Reports** button (with the clipboard icon) in the top action bar.
3. You will see a list of all your complaints categorized by status (`PENDING`,
   `UNDER_INVESTIGATION`, `RESOLVED`, or `REJECTED`).
4. Click on any report card to open its full investigation timeline, view agency notes,
   and inspect the verified after-repair resolution photograph once work is completed.

---

## Rating and reviewing facilities

Citizens can leave feedback on public amenities:

1. Locate the facility on the map and open its **Facility Details** page.
2. Scroll to the **Ratings & Reviews** section.
3. Choose a star rating from 1 to 5 stars.
4. Enter an honest review title/feedback (up to 200 characters) and click **Submit Review**.
5. Past reviews from other citizens are displayed with timestamps to help you assess
   on-ground cleanliness and maintenance.

---

## Recommending a new civic facility

If an essential public amenity is missing in your neighborhood:

1. **How to propose a facility**:
   - **From the Home page**: Scroll to the *Citizen Recommendation* section and click
     the green **Recommend a Facility** button.
   - **From your Citizen Dashboard**: Click the **Recommend Facility** button (with the
     sparkles icon) in the top action bar.
2. **Submitting the proposal**:
   - Choose the facility category (Dustbin, Drinking Water Point, Toilet, or Parking).
   - Enter a title, description of the community need, address, and nearby landmark.
   - Pin the exact location on the interactive map and upload an on-site photo of the
     proposed street or corner.
   - Click **Submit Recommendation**.
3. **Tracking proposal status**: Click **My Recommendations** on your Citizen Dashboard
   to track municipal administrative reviews and field feasibility studies.
