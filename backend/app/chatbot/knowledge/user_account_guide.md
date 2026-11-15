# User account, roles, and security guide

Amar Sohor provides secure, role-based access to safeguard civic operations
while keeping public services accessible to all Kolkata residents.

## User roles and permissions

The platform implements three distinct roles:

1. **Citizen (`USER`)**:
   - Registered members of the public.
   - Can explore the interactive facility map, view facility details, submit ratings
     and reviews, lodge complaints with AI photo verification, track grievance
     progress, and propose new civic facility recommendations.
2. **Agency Member (`AGENT`)**:
   - Field officers and maintenance personnel affiliated with a municipal agency
     (e.g., Solid Waste Management, Water Supply, Sanitation, or Traffic & Parking).
   - Authorized to manage facilities within their agency jurisdiction, conduct on-site
     inspections for assigned grievances, submit resolution evidence, reject invalid
     tickets under the 50% AI threshold rule, and perform feasibility studies on
     recommendations.
3. **Municipal Administrator (`ADMIN`)**:
   - Super-users responsible for city-wide civic administration.
   - Can configure agencies, manage user accounts, assign grievance reports, provision
     agency personnel, and allocate citizen recommendations for field investigation.

---

## Viewing and managing your user profile and dashboard

To visit your citizen profile or manage your account details:

1. **How to access your profile / dashboard**:
   - When signed in, click your name button in the top navigation header on any page to open your **Citizen Dashboard** (`/citizen/dashboard`).
2. **Profile details you can view and edit**:
   - View your registered Full Name, Email Address, and Phone Number.
   - Edit your contact information and click **Save Changes** to immediately update your account profile.
3. **Dashboard features**:
   - Review your submitted civic complaints, active investigation stages, and resolution photo proofs.
   - Track community recommendations you proposed for your neighborhood.
   - Access quick action buttons: **Report an Issue** (which opens the map to pick a facility), **Recommend Facility**, **My Recommendations**, **View My Reports**, and **Explore Map**.

---

## Registration and authentication

1. **How to create an account**:
   - Click the green **Register** button in the top-right corner of the Home page header.
   - Enter your full name, email address, phone number, residential address, and a secure password.
   - Click **Create Account**.
2. **How to sign in**:
   - Click the **Login** button in the top-right corner of the header.
   - Enter your registered email and password.
   - Click **Sign In**.
3. **Session security**: Passwords are cryptographically salted and hashed with
   bcrypt. Authentication tokens expire after 60 minutes of inactivity to protect
   user privacy.

---

## Password recovery workflow

If a user forgets their password:

1. On the sign-in modal/page, click the **Forgot Password?** link below the password field.
2. Enter your registered email address and click **Send Reset Link**.
3. Check your email, open the password reset link, enter your new password, and click **Reset Password** to immediately regain access to your account.
