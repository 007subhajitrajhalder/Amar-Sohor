# Administrator guide

## Administrator responsibilities

Administrators use an `ADMIN` account to oversee platform health, manage
participating civic agencies, allocate citizen proposals, and monitor grievance
resolution quality across Kolkata.

Primary navigation sections in the admin portal:
- **Admin Dashboard**: System-wide metrics (total registered facilities, active
  grievances, resolution rate, and agency performance).
- **User Management**: View citizen and agency accounts, inspect roles, and toggle
  account active statuses.
- **Agency Management**: Create and configure municipal agencies and map handling
  categories.
- **Agency Members**: Add agency personnel and manage member rosters on individual
  agency detail pages.
- **All Complaints**: Global registry and oversight of civic complaints across all agencies,
  with filters for Pending, Investigating, Resolved, and Rejected cases, and evidence approval.
- **Recommendations**: Review citizen infrastructure proposals, filter by status (including
  Rejected), inspect 5-stage lifecycle progress, and allocate proposals to agency members.

---

## Complaint oversight and resolution verification

Municipal administrators oversee civic complaints and verify resolution quality:

1. **Viewing all complaints**: In the admin portal, click **All Complaints** (`/admin/complaints`).
   - Monitor live statistics (Total Registered, Pending Review, In Investigation, Fully Resolved,
     and Rejected Cases).
   - Filter complaints by status: **All**, **Pending**, **Investigating**, **Resolved**, or **Rejected**.
2. **Reviewing complaint details and approvals**:
   - Click any complaint to open **Admin Complaint Details** (`/admin/complaints/:reportId`).
   - Follow the dynamic 4-stage progress tracker:
     1. Complaint Submitted
     2. Field Investigation (agency officer notes)
     3. Resolution Evidence Review
     4. Complaint Resolved or Complaint Rejected
   - **Approve Resolution**: When an agency completes repair work and submits after-repair
     evidence, review the photographic evidence and click **Approve Resolution** to close the ticket.
   - **Inspect Rejections**: For complaints rejected during field inspection, review the agency's
     rejection rationale, inspection record photograph, and completion date.

---

## Recommendation governance and lifecycle tracking

When citizens propose new civic facilities:
1. Open the **Recommendations** section from the admin menu (`/admin/recommendations`) to view
   all citizen proposals.
2. Filter proposals by status: **All Statuses**, **Pending Allocation**, **Allotted**, **Approved**,
   **Installed**, or **Rejected**.
3. **Allocating unallotted proposals**: Click the **Allocate** button on an unallotted proposal,
   select an agency member from the roster, add guidance notes, and click **Confirm Allocation** to
   dispatch the proposal for a field feasibility study.
4. **Tracking proposal progress**: Click **View Progress** or the status badge on any proposal to
   open the **Recommendation Progress** page (`/admin/recommendations/:id/progress`):
   - 5-stage visual stepper: **Submitted** -> **Allocated** -> **Investigation / Rejected** ->
     **Approved** -> **Commissioned**.
   - If rejected, displays a prominent **Civic Proposal Rejected** alert card with the officer's
     technical rejection rationale and highlighted audit activity timeline.

---

## Static information notice

This assistant uses static project reference guides and can answer aggregate
facility-count questions from public facility records. It has no connection to
administrator sessions, cannot look up user or complaint records, and cannot
trigger administrative actions.
