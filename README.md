# CodeYoung Trial Class Booking System

A full-stack trial-class booking system for CodeYoung. Parents book a free trial class,
get auto-matched with an available mentor, and both parties receive an email with a
meeting link. All times are handled correctly across timezones and DST.

## Repo layout

```
codeyoung-booking/
├── backend/           Express + MongoDB API
├── frontend-app/      Parent + mentor facing React app (port 5173)
└── frontend-admin/    Admin React app (port 5174)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod` or a free MongoDB Atlas cluster)

## 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: at minimum set MONGO_URI to your MongoDB connection string.
# SMTP_* can be left blank in development — emails will be logged to the
# console instead of actually sent (see src/services/emailService.js).
# To actually send emails without a personal Gmail account, see
# "Sending real emails" below.
npm install
npm run seed      # creates 1 admin + 10 mentors (idempotent, safe to re-run)
npm run dev        # starts the API on http://localhost:5000
```

**Default seeded accounts** (see `src/scripts/seed.js`):
- Admin: `admin@coach.edu` / `@admin123` — change this after first login from the
  admin app's **Settings** page (calls `PATCH /api/auth/change-password`, which
  works for any role).
- Mentors: `mentor1@codeyoung.dev` … `mentor10@codeyoung.dev` (10 mentors seeded
  by default), password is the mentor's own email address (e.g. logging in as
  `mentor1@codeyoung.dev` uses `mentor1@codeyoung.dev` as the password too). This
  is also how the admin "create mentor" flow sets each new mentor's temp password.
  Mentor accounts are flagged `mustResetPassword: true` — a "force password change
  on first login" UI flow is a good next addition but isn't wired into the
  frontend in this build.
  Each mentor can take up to `defaultMaxClassesPerDay` (2, by default — see
  `AdminConfig`) trial classes per calendar day, configurable per-mentor or
  platform-wide from the admin app.

**Free trial limit**: every booking in this system is a free trial class, and
each parent account gets exactly one, ever. This is enforced server-side
(`User.freeTrialUsed`, checked in `bookingService.createBooking`) — not just
hidden in the UI — and is set the moment a booking is confirmed, so cancelling
a used trial does not free up another one. The parent dashboard reflects this
by disabling/hiding the booking flow once the flag is set.

If `AUTO_SEED_ON_STARTUP=true` in `.env`, the seed also runs once automatically
whenever `npm run dev`/`npm start` boots in development. It's idempotent (upserts
by email) and is hard-disabled in production regardless of this flag.

### Sending real emails (no personal Gmail/app password needed)

By default, with `SMTP_*` left blank, emails are just logged to the console
(dev/dummy mode) — nothing is actually sent. To have the app send real
confirmation, reminder, and mentor-invite emails, `emailService.js` talks to
any generic SMTP server, so you can plug in a free transactional email
provider instead of a personal inbox. **Resend** is the easiest:

1. Sign up free at [resend.com](https://resend.com) (no credit card required).
2. Dashboard → **API Keys** → **Create API Key**.
3. In `backend/.env`, set:
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_USER=resend
   SMTP_PASS=re_your_api_key_here
   EMAIL_FROM=onboarding@resend.dev
   ```
   `onboarding@resend.dev` works out of the box for testing (100 emails/day,
   3,000/month, free). To send from your own domain later, verify it under
   Dashboard → **Domains**, then set `EMAIL_FROM` to an address on that domain.
4. Restart the backend (`npm run dev`). Booking confirmations, class
   reminders, and mentor invites will now actually be delivered.

No code changes are required — this just fills in the existing generic SMTP
branch in `getTransporter()` (`backend/src/services/emailService.js`), the
same one used for the Gmail-app-password path, just with different
credentials.

## 2. Parent/mentor frontend setup

```bash
cd frontend-app
cp .env.example .env
# edit .env (or src/config/firebase.js) with your Firebase web config if you
# want "Continue with Google" to work. Without it, the Google button renders
# as a disabled placeholder. See "Firebase Google sign-in setup" below.
npm install
npm run dev        # http://localhost:5173
```

## 3. Admin frontend setup

```bash
cd frontend-admin
cp .env.example .env
npm install
npm run dev        # http://localhost:5174
```

Log in at `http://localhost:5174/login` with the seeded admin credentials above.

## Firebase Google sign-in setup (optional)

"Continue with Google" (login + signup, parent accounts only) is powered by
Firebase Auth. Without this configured, the button just renders disabled —
password login/signup still works fine. **No service account or private key
is needed anywhere** — the backend verifies the token's signature directly
against Google's public keys.

**Frontend (public config — safe to expose in the built bundle):**
1. [Firebase Console](https://console.firebase.google.com) → your project
   (`codeyoung-b618a`, or create one) → Project Settings → General → "Your
   apps" → add/open a Web app → copy the `firebaseConfig` object.
2. Paste the values into `frontend-app/src/config/firebase.js` directly, or
   into `frontend-app/.env` as `VITE_FIREBASE_*` (either works — env vars
   take priority if both are set).
3. In Firebase Console → Authentication → Sign-in method, enable the
   **Google** provider.
4. In Authentication → Settings → Authorized domains, make sure
   `localhost` is listed (it is by default).

**Backend (also not secret — just the project ID):**
1. Set `FIREBASE_PROJECT_ID` in `backend/.env` to the same `projectId` used
   in the frontend's `firebaseConfig` (defaults to `codeyoung-b618a` already).
2. That's it. `backend/src/config/googleAuth.js` verifies the Firebase ID
   token's signature directly against Google's JWKS endpoint
   (`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`)
   using `jsonwebtoken` + `jwks-rsa`, checking issuer/audience against your
   project ID — no `firebase-admin`, no service account, no private key
   anywhere in this flow. `authService.js` and everything downstream is
   unchanged since it consumes the same `{ googleId, email, name,
   emailVerified }` shape either way.

## How timezones/DST are handled

Every timestamp is stored in UTC in MongoDB. Conversion to a person's local time
happens only at the display layer (API responses) and the email layer, always via
their stored **IANA timezone identifier** (e.g. `Asia/Kolkata`, `America/New_York`),
never a fixed UTC offset. This is what makes DST transitions "just work" — see
`backend/src/utils/timezone.js`, which is the single shared module both the API and
the email templates use. The mentor's own local calendar date (not UTC, not the
parent's date) is precomputed and stored on each `Booking` (`mentorLocalDate`) so the
"max 2 classes per mentor per day" rule is always counted correctly.

## Architecture notes

- Backend follows routes → controllers → services → models, with a centralized error
  handler and zod validation at the route boundary (see `backend/src/middleware`,
  `backend/src/utils/schemas.js`).
- The mentor-matching algorithm (`backend/src/services/matchingService.js`) filters
  for active mentors under their daily cap with no slot conflict, then load-balances
  by picking whichever eligible mentor has the fewest bookings that day.
- Signup can only ever create `parent` accounts — the backend never reads a `role`
  field from the signup request body at all, so a client can't force-create a mentor
  or admin account regardless of what it sends.
- Mentor accounts are only created by an admin (`POST /api/admin/mentors`), which
  also sends an invite email with a temp password.
- Admin has its own login endpoint (`POST /api/auth/admin-login`) with no
  parent/mentor role toggle, since admin accounts are pre-seeded and never
  self-registered.

## Known limitations / good next steps

- No live database was available in the environment this was built in, so the
  backend was verified via syntax checks, a clean `npm install`, a successful
  `require()` of the full app graph, and standalone unit tests of the DST/timezone
  logic — but not yet exercised against a running MongoDB instance end-to-end.
  Run `npm run seed` then exercise the booking flow manually against your own
  MongoDB before relying on this in production.
- Mentor "mark myself unavailable" UI is not built (the `unavailableSlots` field
  and matching-service check for it already exist on the backend).
- Password reset / forgot-password flow is not implemented (optional stretch
  per the spec).
- "Force password reset on first login" UI is not implemented for mentors;
  they can log in with their email-as-password indefinitely. The backend
  already supports `PATCH /api/auth/change-password` for any role, so this
  is just a matter of adding a "change password" form to the mentor
  dashboard that's shown/required when `mustResetPassword` is `true`.
