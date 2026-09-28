# TRANSCRIPT

## User

Full stack Engineer Task:

At Codeyoung, parents have the option to book a "trial class" to experience our product and the quality coaching our mentors provide before signing up.

This is the flow parents usually go through:

1. Parents pick a time slot that's comfortable for them.
2. We assign an available mentor
3. We email both the mentor and the parent a link that takes them to a live class.

The task is to build a similar appointment-booking system which has:

- 10 mentors available for trial classes
- 20 parents interested in booking a trial class per day

Build a web app that parents can use to book this trial class. You should use NodeJS or Python for any backend APIs and React for the frontend.

Feel free to use any other backend or frontend libraries.

Requirements:

1. Mentors and parents may be in different time zones. Usually, parents are in the US or UK, and mentors are in India. Please make sure local times are always displayed and communicated to them.
2. Daylight Savings Time is a niggle you have to handle.
3. Parents and mentors can receive a dummy link. It's assumed that the link will work and will take them to a demo class.
4. Mentors have at most 2 demo classes a day.
5. If no mentors are available, use your judgment to communicate an appropriate error state.

Build a complete, professional coaching application with a well-structured **frontend, backend, and MongoDB database**. The code should be clean, modular, refactored, scalable, and follow professional software development practices.

### 1. Home Page
Create a modern home page that:
- Provides a brief introduction to the coaching application.
- Clearly explains the purpose and key features of the platform.
- Provides clear navigation options for **Login** and **Sign Up**.
- Includes a professional and responsive UI.

### 2. Authentication
Implement authentication using both **Google OAuth** and **email/password**.

#### Google Authentication
- Allow users to sign up and log in using their Google account.
- Retrieve and store the user's name and email.

#### Email/Password Authentication
- Sign-up should require:
  - Name
  - Email
  - Password
- Only **parents** can register through the public sign-up page.
- **Mentors cannot register themselves.**
- Mentors must be created by the **Admin**.
- During login, users must select their role:
  - Parent
  - Mentor
- Validate the selected role against the user's actual role stored in the database.

### 3. Admin Panel
Create a **separate frontend application** for the Admin.

The Admin should be able to:
- Log in securely.
- Add and manage mentors.
- Create mentor accounts with the required details.
- Edit mentor information.
- Activate/deactivate mentors.
- Manage application configurations.
- View and manage users.
- Manage scheduled classes.
- Perform other necessary administrative operations.

### 4. Parent Dashboard
After logging in as a parent, redirect the user to the **Parent Dashboard**.

The dashboard should display:
- Upcoming scheduled classes.
- Previous/completed classes.
- Class date and time.
- Mentor details.
- Meeting/Google Meet link.
- Class status.
- Other relevant information.

Parents should also be able to:
- Schedule classes with available mentors.
- View their scheduled classes.
- Cancel or reschedule classes if permitted.
- Access their profile and account information.

### 5. Mentor Dashboard
After logging in as a mentor, redirect the user to the **Mentor Dashboard**.

The dashboard should display:
- Upcoming classes.
- Previous classes.
- Parent/student details.
- Class date and time.
- Meeting/Google Meet link.
- Class status.

Mentors should be able to manage their assigned classes according to the application's requirements.

### 6. Class Scheduling and Email Validation
When scheduling a class:
- The parent's email address must be entered.
- Before the class is confirmed, verify that the email address exists in the application's database.
- If the email does not exist, display an appropriate error message immediately and prevent the class from being confirmed.
- Do not allow a class to be scheduled until the email has been successfully validated.
- Store all class scheduling information in MongoDB.

### 7. Class Reminder Emails
For every confirmed class:
- Send a reminder email to the parent **one hour before the scheduled class**.
- The reminder email must contain:
  - Class details
  - Date and time
  - Mentor details
  - Google Meet/joining link
- Implement this using a reliable background job/scheduler system.
- Make sure reminder emails are not sent more than once for the same class.

### 8. Time Zone Handling
Parents and mentors may be located in different time zones, such as parents in the **US or UK** and mentors in **India**.

Therefore:
- Store scheduled times consistently in the database, preferably in UTC.
- Display class times in the user's local time zone.
- Clearly communicate the correct local time to both parents and mentors.
- Ensure reminder emails are sent at the correct time based on the scheduled class time.

### 9. Dashboard Class History
After login, both parents and mentors should have access to a dashboard containing:
- All previously completed classes.
- All upcoming classes.
- Cancelled classes where applicable.
- Class details and meeting links.
- Appropriate filtering and sorting options.

### 10. Backend
Build a secure and scalable backend with:
- RESTful APIs.
- Authentication and authorization.
- Role-based access control.
- Parent, mentor, admin, and class management.
- MongoDB integration.
- Proper validation and error handling.
- Secure password hashing.
- Secure authentication tokens/sessions.
- Email service integration.
- Scheduled/background jobs for reminder emails.

### 11. Database
Use **MongoDB** as the primary database.

Design proper schemas/models for:
- Users
- Parents
- Mentors
- Admins
- Classes/Schedules
- Authentication-related data
- Application configurations
- Any other required entities

Use appropriate indexes, relationships/references, validation, timestamps, and database best practices.

### 12. Environment Variables
Use separate `.env` files for environment-specific configuration.

Do not hardcode:
- Database credentials
- JWT secrets
- Google OAuth credentials
- Email credentials
- API keys
- Other sensitive configuration

Provide a `.env.example` file containing all required environment variables without exposing actual secrets.

### 13. Code Structure
Follow a professional and scalable project structure with:
- Separate frontend and backend applications.
- Modular components.
- Reusable UI components.
- Separate routes, controllers, services, models, middleware, utilities, and configuration files.
- Centralized error handling.
- Proper API response handling.
- Clean naming conventions.
- No duplicated code.
- No unnecessary files or dependencies.
- Clear separation of concerns.

### 14. UI/UX
Create a modern, responsive, professional interface for:
- Home page
- Login
- Parent registration
- Parent dashboard
- Mentor dashboard
- Class scheduling
- Class history
- Profile/settings
- Admin dashboard

The application should work properly on desktop, tablet, and mobile devices.

### 15. Overall Requirement
Build the application as a complete production-ready system with **three separate role-based experiences: Parent, Mentor, and Admin**, including authentication, authorization, scheduling, MongoDB persistence, Google authentication, email verification/validation, automated one-hour class reminders, timezone handling, dashboards, and proper frontend-backend integration.

The final code should be **professional, well-refactored, maintainable, secure, scalable, and properly documented**.

Make a detailed prompt for me for this also explain how each page should be

## Assistant

# CodeYoung Trial Class Booking System — Build Prompt & Page-by-Page Spec

Use this as the master prompt to feed into your AI coding assistant (Claude Code, etc.). It is written so that if you paste it in as-is, the AI has enough context to scaffold the entire app in one pass, then you iterate section by section.

---

## 1. Project Summary (give this to the AI first)

> Build a full-stack trial-class booking system for an ed-tech company called CodeYoung.
> Parents book a free trial class, get auto-matched with an available mentor, and both
> parties receive an email with a dummy meeting link. Mentors handle at most 2 trial
> classes per day. Parents are usually in the US/UK, mentors are in India — all times must
> be displayed and communicated in each user's own local time zone, correctly handling
> Daylight Saving Time. There is a separate admin frontend for managing mentors and
> platform configuration.
>
> Stack: React (frontend, with a separate admin frontend), Node.js + Express (backend
> REST API), MongoDB (database via Mongoose), JWT-based auth, Google OAuth as an
> additional login method, Nodemailer (or similar) for transactional email, node-cron
> (or agenda/bull) for the reminder-email job. Use `.env` files for all secrets/config
> (never hardcoded). Structure the code the way a senior engineer would: layered
> architecture (routes → controllers → services → models), input validation, error
> handling middleware, and no logic duplication between the parent/mentor flows.

---

## 2. Tech Stack (explicit, so the AI doesn't improvise inconsistently)

| Layer | Choice |
|---|---|
| Frontend (parent/mentor app) | React + Vite, React Router, Axios, a component library (MUI or shadcn/ui), `date-fns-tz` or `luxon` for timezone/DST math |
| Frontend (admin app) | Separate React + Vite project (its own repo folder, own build, own port) |
| Backend | Node.js + Express, Mongoose (MongoDB ODM) |
| Auth | JWT (access token) + Google OAuth 2.0 (Passport.js `passport-google-oauth20` or `google-auth-library` token verification) |
| Database | MongoDB (Atlas or local) |
| Email | Nodemailer with a transactional provider (SMTP / SendGrid / Mailtrap for dev) |
| Scheduled jobs | `node-cron` or `agenda` for the "1 hour before class" reminder |
| Timezones | Store everything in UTC in the DB; convert to local time only at the display/email layer using IANA timezone identifiers (e.g. `America/New_York`, `Asia/Kolkata`), never fixed UTC offsets, so DST is handled automatically by the timezone library |

---

## 3. Monorepo / Folder Structure to Request

```
codeyoung-booking/
├── README.md
├── TRANSCRIPT.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── src/
│   │   ├── config/          # db connection, passport config, env loader
│   │   ├── models/          # User, Mentor, Parent, Booking, Slot, AdminConfig
│   │   ├── controllers/
│   │   ├── services/        # matching logic, email service, timezone service
│   │   ├── routes/
│   │   ├── middleware/       # auth guard, role guard, error handler, validators
│   │   ├── jobs/             # cron job for reminder emails
│   │   ├── utils/
│   │   └── app.js / server.js
│   └── package.json
├── frontend-app/             # parent + mentor facing React app
│   ├── .env.example
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/ (auth context)
│   │   ├── services/ (api calls)
│   │   └── utils/ (timezone formatting helpers)
│   └── package.json
└── frontend-admin/            # separate admin React app
    ├── .env.example
    └── src/...
```

---

## 4. Roles & Auth Requirements

- Two roles: `parent` and `mentor`. A third implicit role `admin` only exists in the admin app (no public admin signup — admins are seeded/created directly in DB or via a protected script).
- **Signup**: available only to parents. Fields: name, email, password. Also support **"Sign up with Google"**.
- **Login**: available to both parents and mentors, via email+password OR Google OAuth. Since one login page serves both roles, the user must **select their role before/at login** (e.g., a toggle "I am a Parent / I am a Mentor"). On login, the backend must verify the selected role matches the account's actual stored role — if a mentor account tries logging in as "parent," reject with a clear error (mentors are never allowed to self-register, so this also guards against role confusion).
- Mentor accounts are **not self-service** — they only get created by an Admin via the Admin app. When an admin creates a mentor, the system should send that mentor an invite/set-password email (or a default temp password) so they can log in.
- Passwords hashed with bcrypt. JWT stored in httpOnly cookie or Authorization header (your call — pick one and be consistent).
- Store each user's IANA timezone (auto-detected from browser on signup via `Intl.DateTimeFormat().resolvedOptions().timeZone`, editable in profile).

---

## 5. Page-by-Page Specification

### A. Public Home Page (`/`)
**Purpose:** Marketing/landing page, first thing any visitor sees.
- Brief intro/hero section about CodeYoung (what the coaching app does, value prop, mentor quality).
- A short "How it works" strip (3 steps: pick a slot → get matched with a mentor → join your trial class).
- Two clear calls to action: **Log In** and **Sign Up** (Sign Up should be visually primary since that's the parent acquisition funnel; mentors will typically arrive via a direct login link since they don't self-register).
- No booking functionality lives here — this page is unauthenticated and purely informational + navigation.

### B. Login Page (`/login`)
- Role selector (Parent / Mentor) — required before submitting.
- Email + Password fields, "Forgot password" link (optional stretch).
- "Continue with Google" button (Google OAuth flow). After Google auth, if it's a brand-new Google user with no role decided, force them into a lightweight role-confirmation step *only if the account doesn't already exist* (mentors won't hit this since their accounts already exist and are pre-assigned a role by admin).
- On success: route parent → `/parent/dashboard`, mentor → `/mentor/dashboard`.
- Clear inline error states: wrong password, account doesn't exist, role mismatch ("This account is registered as a Mentor, please log in from the Mentor tab").

### C. Signup Page (`/signup`) — Parents only
- Name, Email, Password (+ confirm password), plus a hidden/derived timezone field.
- "Sign up with Google" alternative.
- No role selector here at all — signup is hardcoded to create a `parent` account. If someone tries to hit a signup API with `role: mentor`, the backend must reject it regardless of what the frontend sends (never trust the client).
- After signup, auto-log-in and redirect to parent dashboard, or ideally straight into the booking flow since that's the core action a new parent wants.

### D. Admin App (fully separate frontend, e.g. runs on its own port/subdomain)
- Its own login (admin credentials are pre-seeded — not part of the public signup/login system at all).
- **Mentor management:** list mentors, add a new mentor (name, email, timezone, subjects/expertise if relevant), edit/deactivate a mentor, view a mentor's current schedule/load.
- **Configuration:** things like max classes per mentor per day (default 2, but admin should be able to tune it), the reminder-email lead time (default 1 hour), available slot durations, business hours per region, blackout dates/holidays.
- **Visibility:** a view of all bookings platform-wide (for support/debugging), and basic stats (bookings today, mentor utilization) — good to have but not the core requirement, keep it simple.

### E. Parent Dashboard (`/parent/dashboard`)
- **Book a Trial Class** entry point (primary action).
- **Upcoming classes** list — each item shows date/time in the parent's own local time, assigned mentor name, and the (dummy) meet link, plus a cancel/reschedule option if you choose to support it.
- **Past classes** list — historical record, no actions needed beyond viewing.
- This is effectively one dashboard with tabs/sections: "Book New", "Upcoming", "Past".

### F. Mentor Dashboard (`/mentor/dashboard`)
- **Today/Upcoming classes** — list of assigned trial classes, shown in mentor's local time (India, so `Asia/Kolkata`), with parent name and the meet link.
- **Past classes** — history.
- Mentors do not book classes themselves — they are assigned by the system — so no "book" action here, only visibility. (Optional stretch: let a mentor mark themselves unavailable for a slot/day, which the admin config or a mentor-availability model should support.)

### G. Booking Flow (within Parent Dashboard, could be a modal or its own route `/parent/book`)
1. Parent picks a date, then sees available time slots **displayed in their own local timezone**, computed from mentor availability which is stored in IST/UTC.
2. Parent selects a slot and confirms.
3. **Email existence check**: before final confirmation, the system must verify the parent's email is valid/exists — e.g. re-confirm the logged-in email, or if booking allows entering a different contact email, validate it (format validation at minimum; if you want to go further, an email-verification/OTP step or a validation API). If invalid, show the error **before** allowing confirmation, not after.
4. Backend runs the **mentor-matching algorithm**: find a mentor who (a) is active, (b) has fewer than `maxClassesPerDay` (default 2) classes already booked for that calendar day *in the mentor's own local day*, and (c) has no overlapping booking at that exact slot. Assign the first available match (or add smarter load-balancing as a nice-to-have — pick whichever mentor has the fewest classes that day, to spread load evenly across your 10 mentors for 20 parents/day).
5. If no mentor is available for the chosen slot: show a clear, friendly error state (e.g., "This time is fully booked — please try a different slot" or suggest the next available slot) rather than a raw failure. Never silently fail.
6. On success: create the `Booking` record, send confirmation emails immediately to both parent and mentor (with the dummy meet link and correct localized time for each recipient), and schedule the reminder job for `slot_start_time - 1 hour`.

---

## 6. Data Model (MongoDB / Mongoose) — suggested shape

- **User**: `_id, name, email, passwordHash (nullable if Google-only), googleId (nullable), role ('parent'|'mentor'|'admin'), timezone, createdAt`
- **MentorProfile** (1:1 with User where role=mentor): `userId, maxClassesPerDay (default 2, overridable by admin config), active, expertise[]`
- **Booking**: `parentId, mentorId, startTimeUTC, endTimeUTC, meetLink, status ('confirmed'|'cancelled'|'completed'), reminderSentAt, createdAt`
- **AdminConfig**: singleton or key-value config doc: `defaultMaxClassesPerDay, reminderLeadTimeMinutes, slotDurationMinutes, businessHours, blackoutDates[]`

Store **all timestamps in UTC**. Convert to local only at the API-response/formatting layer or email-template layer, using the recipient's stored `timezone` (IANA string) — this is what makes DST "just work," since IANA timezone databases already encode DST transitions; never store or reason in raw UTC offsets like `+05:30` alone.

---

## 7. Core Backend Endpoints (example — let the AI flesh these out)

```
POST /api/auth/signup            (parent only)
POST /api/auth/login              (body includes selected role)
POST /api/auth/google
GET  /api/mentors/availability?date=&timezone=
POST /api/bookings                (creates booking, runs matching + email-exists check)
GET  /api/bookings/me             (role-aware: parent sees own, mentor sees assigned)
--- Admin ---
POST /api/admin/mentors
GET  /api/admin/mentors
PATCH /api/admin/mentors/:id
GET  /api/admin/config
PATCH /api/admin/config
GET  /api/admin/bookings
```

---

## 8. Edge Cases to Explicitly Handle (call these out to the AI)

- DST transition days (spring-forward/fall-back) — a slot at "9am India time" must map to the correct US local time even the week DST changes, so *always* convert via IANA zones, never hardcoded offsets.
- No mentor available at all for a slot → graceful error, ideally suggesting alternate times.
- Parent tries to book a 3rd slot with an already-fully-booked day → same graceful handling, transparent about why.
- Email entered doesn't exist / is malformed → block confirmation with inline error, not after submission.
- Reminder job must not double-send if the server restarts (idempotency — track `reminderSentAt`).
- Mentor's "day" for the max-2-per-day rule should be counted in the **mentor's own local date**, not UTC date or the parent's date — otherwise a class at 11pm US / 9am India could get miscounted into the wrong day.
- Admin deactivating a mentor mid-day shouldn't cancel their already-confirmed classes, just stop new assignments.

---

## 9. Environment Variables (`.env.example` for backend)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codeyoung
JWT_SECRET=
JWT_EXPIRY=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@codeyoung.example
REMINDER_LEAD_TIME_MINUTES=60
DEFAULT_MAX_CLASSES_PER_MENTOR_PER_DAY=2
FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:5174
```

(Mirror the relevant public ones — API base URL, Google client ID — into `.env.example` for each React app.)

---

## 10. Code Quality Instructions to Give the AI Explicitly

- Layered architecture: routes only parse/delegate, controllers orchestrate, services hold business logic (matching algorithm, timezone conversion, email sending), models are pure schema/data access.
- Centralized error handler middleware; controllers should `next(err)` rather than try/catch-and-format everywhere.
- Input validation via a library (`zod`, `joi`, or `express-validator`) at the route boundary.
- No secrets committed — `.env` gitignored, `.env.example` committed with dummy values.
- Shared timezone/date utilities in one module, reused by both API responses and email templates — do not duplicate date-formatting logic.
- Meaningful commit-worthy structure even if you're not actually making granular commits — the code should read as if it were.

---

## 11. Submission Checklist (don't let this slip)

- [ ] GitHub repo, public or with access granted
- [ ] `README.md` — setup instructions for backend, frontend-app, and frontend-admin (env vars, install, run, seed an admin/mentor if needed)
- [ ] `TRANSCRIPT.md` — full export of your AI coding session(s)
- [ ] Email to `campus.ka@talentiseglobal.com` before **28 Sept 2026, 6:00 PM**, subject: `Codeyoung Assignment Task - <Your Name> - <Institute Abbreviation>`

---

### How to use this document
Paste Sections 1–10 into your AI coding assistant as the initial project prompt. Then go page by page (Section 5) asking it to build one piece at a time — home page first, then auth, then parent dashboard + booking flow, then mentor dashboard, then admin app, then the email/reminder job last — so you can review and correct course between each stage rather than generating everything at once.

---

I put together the full spec above as a file. It covers the tech stack, folder structure, auth/role rules, a page-by-page breakdown (home, login, signup, admin app, parent dashboard, mentor dashboard, booking flow), the data model, key API endpoints, edge cases (especially DST and mentor-matching), env variables, and the submission checklist.

Best way to use it: hand Sections 1–10 to your AI coding assistant as the opening prompt, then work through Section 5 page by page (home, auth, parent dashboard/booking, mentor dashboard, admin app, email/reminder job last), reviewing each stage before moving on.

## User

presntly there need to 10 mentors.include them by default.

## Assistant

Added the following new section to the spec, and renumbered the remaining sections after it:

## 6. Seed Data — 10 Default Mentors

The system must ship with **10 mentors already in the database by default** — a fresh clone
of the repo should not require an admin to manually add mentors before the app is usable.

- Add a `backend/src/scripts/seed.js` (or `seeders/mentors.js`) script that inserts 10
  mentor `User` + `MentorProfile` documents if they don't already exist (idempotent —
  safe to run multiple times, e.g. upsert by email).
- Give each seeded mentor a realistic name, a unique dummy email (e.g.
  `mentor1@codeyoung.dev` … `mentor10@codeyoung.dev`), timezone `Asia/Kolkata`, `active: true`,
  and `maxClassesPerDay` defaulting to the admin config value (2).
- Set a known default password (e.g. `Mentor@123`, documented in the README) or mark them
  as needing a password-reset on first login — either is fine, just be explicit about it
  so whoever tests the app can actually log in as a mentor.
- Wire this into `README.md` setup instructions as a required step, e.g. `npm run seed`,
  and ideally also auto-run it once on server startup in development
  (guarded so it never wipes/duplicates data, and never runs automatically in production).
- The Admin app's mentor list should show these 10 out of the box, and admin can still add,
  edit, or deactivate mentors from there on top of the seeded set — seeding just removes
  the "empty state" problem for reviewers/graders opening the app for the first time.

Added a new **Section 6, Seed Data** that requires the app to ship with all 10 mentors already in the database via an idempotent seed script (`npm run seed`), with dummy emails, `Asia/Kolkata` timezone, a documented default password, and instructions wired into the README, so a grader opening the app doesn't hit an empty mentor list. Renumbered the rest of the doc accordingly.



## Assistant

Updated `TRANSCRIPT.md` so it contains only your requests and my responses, with no extra notes, headers, or appendix.
