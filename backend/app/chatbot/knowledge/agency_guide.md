# Agency member guide

## Agency portal navigation and workflow

Agency members use the authenticated agency portal with an `AGENT` account.
Each agency manages civic amenities and grievances within its municipal domain
(such as Solid Waste Management, Water Supply, Public Sanitation, or Traffic & Parking).

Primary navigation sections in the agency portal:
- **Agency Dashboard**: Overview of assigned complaints, active investigations,
  and completed resolutions.
- **Assigned Reports**: Unified hub of all assigned citizen grievances (Pending,
  Under Investigation, Resolved, and Rejected).
- **Facility Management**: Catalog of all physical amenities under agency care.
- **Add Facility**: Tool to register a newly installed public facility.
- **Assigned Recommendations**: Citizen proposals allocated by municipal admins for
  feasibility studies.

---

## Managing public facilities

Agency members can maintain the physical catalog of facilities under their jurisdiction:

1. **How to add a new facility**:
   - In the agency navigation menu, select **Facility Management**.
   - Click the **Add Facility** button.
   - Enter the official facility name, select its category (Dustbin, Toilet, Drinking
     Water Point, or Parking), provide the street address, set its coordinates, and upload
     a clear reference photograph.
   - Click **Save Facility**.
2. **Updating operational status**:
   - On the **Facility Management** page, click the **Edit** button on any facility card.
   - You can update its status between:
     - `OPEN`: Fully functional and available to the public.
     - `UNDER_REPAIR`: Marked when maintenance crews are actively repairing the unit.
       New citizen complaints are temporarily locked to prevent duplicate alerts.
     - `SUSPENDED`: Temporarily taken offline or out of service.

---

## Investigating and resolving citizen grievances

Agency field officers process assigned reports through a structured on-site workflow:

1. **Viewing and navigating assigned reports**:
   - In the agency portal, click **Assigned Reports** from the menu.
   - Filter tickets by status (**All**, **Pending**, **Under Investigation**, **Resolved**,
     or **Rejected**) or search by facility name and address.
   - Click the **Investigate** button on any report card to open its **Investigation** view.
2. **Starting an investigation**:
   - For pending complaints, review the citizen's complaint photograph alongside the automated
     **AI defect classification** and confidence score in the investigation notes.
   - Click the **Start Investigation** button to move the status from `PENDING` to
     `UNDER_INVESTIGATION`.
3. **Submitting resolution evidence**:
   - Once field repair or cleaning work is completed, click **Go to Resolution** on the
     investigation page.
   - Enter the actual completion date and a detailed description of the repairs.
   - Upload an **After-Repair Resolution Photograph** taken at the site.
   - Click **Submit Resolution**.
4. **Automated AI resolution checks**:
   - The AI engine instantly verifies the evidence:
     - **Anti-duplicate check**: Rejects photos having $\ge 98.5\%$ similarity to the
       initial complaint photo (preventing fraudulent re-upload of the citizen's image).
     - **Scene consistency match**: Compares deep background geometry and surroundings
       with the complaint photo (requires at least $35\%$ spatial background match).
     - **Cleanliness / validity verification**: Checks that the facility is clean or
       repaired.
5. **Reviewing resolved reports**:
   - For reports marked `RESOLVED`, opening the **Investigation** view displays the complete
     official resolution record, completion date, after-repair evidence photograph, and
     verification status in the resolution panel.

---

## Outright rejection rules (50% AI threshold)

If a citizen's complaint is unfounded, an agency officer can reject the ticket from the
**Investigation** view by clicking the **Reject Report** button:

- **Good facility or low-confidence complaint (< 50%)**: If the AI classified the
  facility as clean/operational, or if the defect confidence is below 50%, enter an
  administrative reason and confirm rejection. The original citizen photo is saved for
  audit records.
- **AI-verified defect (>= 50%)**: If the AI model confirmed a defect with $50\%$ or
  greater confidence, the officer **must upload an on-site inspection proof photo**. The
  system validates this proof photo with AI before completing rejection.
- **Restarting investigation on rejected cases**: All rejected cases remain accessible in
  **Assigned Reports** under the `Rejected` filter. Agency officers can open the report's
  **Investigation** view, review the recorded rejection rationale and inspection photo, and click
  **Restart Investigation** to resume investigation and reset the case to `UNDER_INVESTIGATION`.

---

## Handling facility recommendations

When municipal administrators allocate a citizen proposal to an agency officer:

1. In the agency navigation menu, click **Assigned Recommendations**.
2. Select the allocated proposal to open its **Feasibility Investigation** page.
3. Conduct the on-site study (checking physical space, underground utility lines, and
   drainage connections).
4. Enter investigation notes and mark the proposal as **Approved** (recommended for
   construction) or **Rejected** (with technical justifications).
