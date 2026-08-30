# Mendyr Backend API Specification

## 1. Overview

This document specifies the HTTP API contract between the Mendyr frontend (Next.js web app + Capacitor-wrapped iOS/Android shells, repo `mendyr-frontend`) and the FastAPI backend now being built at `/Users/salescode/Documents/Mendyr-Backend`.

It is **derived directly from the frontend source code** — actual `fetch`/`apiFetch`/RTK Query calls, Redux slice reducers, TypeScript types, form schemas, and rendered UI affordances (buttons, forms) that are not yet wired to a network call. Every endpoint below cites the frontend file(s) it was grounded in. Where an endpoint is **inferred** (i.e., no live fetch call exists yet, only a type shape or an unwired button), this is called out explicitly in that endpoint's description — these are the endpoints the backend team should confirm with product/frontend before treating as final.

### Base URL

The frontend never uses relative API paths. It resolves every call against an absolute origin, because the Capacitor native shells (iOS/Android) load the app bundle from a local scheme (`capacitor://`) that has no same-origin relationship with the API server — a relative fetch would fail silently.

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

(see `.env.example`). All API routes are mounted below this origin. Two path prefixes are in use:

- **`{NEXT_PUBLIC_API_URL}/api/auth/...`** — authentication boundary endpoints (login, register, me, logout, OAuth, change-password). No `v1` segment.
- **`{NEXT_PUBLIC_API_URL}/api/v1/...`** — everything else (public marketing, admin, super admin, nurse, patient resources).

Every request that expects the caller to be authenticated is sent with `credentials: "include"` (`src/lib/api-client.ts`, `src/store/api.ts`) so that the session cookie is attached across origins. CORS on the FastAPI side must therefore allow credentialed cross-origin requests from the configured web/app origins.

### Companion environment context

Other `.env.example` values relevant to the API surface (not directly part of the HTTP contract but referenced throughout this doc):

- `JWT_EXPIRES_IN=15m`, `JWT_REFRESH_EXPIRES_IN=30d` — implies short-lived access token + long-lived refresh token, both delivered as httpOnly cookies (see §2.3).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — backs `GET /api/auth/google`.
- `RATE_LIMIT_LOGIN=5`, `RATE_LIMIT_REGISTER=3`, `RATE_LIMIT_API=100` — see §2.5.
- `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` — seed super-admin credentials for bootstrap.

---

## 2. Conventions

### 2.1 Response envelope — `ApiResponse<T>`

Every endpoint response (success or failure) is expected to conform to this exact shape, as defined in `src/types/index.ts`:

```ts
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  meta: PaginationMeta | null;
  error: ApiError | null;
}
```

- On success: `success: true`, `data` holds the payload (object or array), `error: null`. `meta` is populated only for paginated list endpoints, otherwise `null`.
- On failure: `success: false`, `data: null`, `error` populated, `meta: null`.

### 2.2 Pagination — `PaginationMeta`

```ts
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

Default page size is `20` (`DEFAULT_PAGE_SIZE` in `src/lib/constants.ts`); `MAX_PAGE_SIZE` is `100`. List endpoints accept `page` (default `1`) and `limit` query params.

### 2.3 Error shape — `ApiError`

```ts
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

`code` is a machine-readable string (e.g. `INVALID_CREDENTIALS`, `VALIDATION_ERROR`, `NOT_FOUND`, `DUPLICATE_EMAIL`, `FORBIDDEN`, `UNAUTHORIZED`, `RATE_LIMITED`, `CONFLICT`); `message` is human-readable and is what the frontend surfaces directly in toasts/inline errors (e.g. login page renders `data.error?.message`, falling back to a hardcoded string if absent). `details` may carry field-level validation errors. Exact code enum is not fixed by the frontend today — recommend the backend define and document a stable code list; the frontend only branches on `success`/absence, not on specific `code` values, so codes can be introduced freely as long as `message` is always present.

### 2.4 Authentication strategy

**httpOnly cookie sessions**, not bearer tokens read by JS. Evidence:

- `src/store/api.ts` (RTK Query base): `credentials: "include"` with a comment: *"Tokens are handled via httpOnly cookies in Mendyr architecture, so we don't need to manually attach an Authorization header here."*
- `src/hooks/use-auth.ts`: calls `GET /api/auth/me` with no manual header attachment; treats a non-ok response as "not authenticated" (`user = null`), and on network failure (backend unreachable) falls back to a **client-only mock session** for local development resilience — this is frontend-only behavior, not something the backend needs to support.
- Cookie names implied by `src/lib/constants.ts`: `JWT_COOKIE_NAME = "mendyr_access_token"`, `REFRESH_COOKIE_NAME = "mendyr_refresh_token"`.
- Token lifetimes from `.env.example`: access token 15 minutes, refresh token 30 days — the backend is expected to silently rotate the access token cookie (e.g. on `/api/auth/me` or a dedicated refresh flow) using the refresh cookie; no explicit `/api/auth/refresh` call was found in the frontend, so refresh is assumed to happen transparently server-side (e.g. via short-lived-cookie + refresh-on-401-once pattern, or a middleware-level silent refresh). **Flagged as a gap** — recommend the backend exposes the refresh mechanism it needs and the frontend team wires it explicitly, since no such call currently exists in `api-client.ts`.
- Logout (`POST /api/auth/logout`) is expected to clear both cookies server-side; the frontend clears local state and redirects regardless of the network outcome (errors are swallowed).

No `Authorization: Bearer <token>` header is ever set by the frontend. The backend should not expect one.

### 2.5 Role-based access control

Four system roles, in descending privilege order (`ROLE_HIERARCHY` in `src/lib/constants.ts`):

| Role | Hierarchy | Portal / nav config |
|---|---|---|
| `SUPER_ADMIN` | 0 (highest) | `SUPER_ADMIN_NAV_LINKS`: Dashboard, Admins, Roles, Permissions, Audit Logs, Settings |
| `ADMIN` | 1 | `ADMIN_NAV_LINKS`: Dashboard, Nurses, Patients, Services, Waitlist, Contacts |
| `NURSE` | 2 | `NURSE_NAV_LINKS`: Dashboard, Appointments, Messages, Availability, Earnings, Documents, Status, Profile, Settings |
| `PATIENT` | 3 (lowest) | `PATIENT_NAV_LINKS`: Dashboard, Profile, Settings |

`src/lib/constants.ts` also defines a fixed, code-level permission matrix (`PERMISSIONS` — ~26 `resource:action` strings such as `nurse:approve`, `service:delete`, `admin:suspend`) and `DEFAULT_ROLE_PERMISSIONS` mapping each role to its permission subset (`SUPER_ADMIN` gets every permission; `ADMIN` gets nurse/patient/service/contact/waitlist/audit permissions; `NURSE` and `PATIENT` get narrow self-service permissions). This strongly suggests RBAC in this product is intended as a **fixed, code-defined matrix**, not a live admin-editable CRUD resource — see the Super Admin Roles/Permissions section and the Known Gaps section for the implications.

Every endpoint below states its allowed role(s). Endpoints under `PUBLIC`/`public` require no authentication.

### 2.6 Rate limiting

From `.env.example` / `RATE_LIMITS` in `src/lib/constants.ts`:

| Bucket | Max requests | Window | Applies to |
|---|---|---|---|
| `login` | 5 (`RATE_LIMIT_LOGIN`) | 60s | `POST /api/auth/login` |
| `register` | 3 (`RATE_LIMIT_REGISTER`) | 3600s (1h) | `POST /api/auth/register` |
| `api` | 100 (`RATE_LIMIT_API`) | 60s | general authenticated API traffic (catch-all) |

Recommend limiting by IP for the `login`/`register` buckets (pre-auth) and by user/session for the general `api` bucket. A `429` response should use the standard `ApiResponse` envelope with `error.code = "RATE_LIMITED"`.

### 2.7 Other conventions

- Public-facing resource identifiers are always a `publicId` string (never raw internal DB ids) — every `*Public` type (`UserPublic`, `NurseProfilePublic`, `ServicePublic`, etc.) exposes `publicId` as the external key. Path params like `{publicId}` refer to this field.
- Timestamps are ISO 8601 strings (`createdAt`, etc.).
- Multipart file uploads (nurse documents, message attachments) use `multipart/form-data`; all other request bodies are `application/json`.

---

## 3. Authentication & Public Marketing/Intake (unauthenticated)

Base path: `/api/auth/*` (auth boundary) and `/api/v1/*` (public content/intake). Client always sends `credentials: "include"`.

> **Discrepancies found in frontend code, flagged for deliberate resolution rather than silent unification:**
> 1. Login success handler reads `data.data.user.role` (`src/app/(auth)/login/page.tsx`) — login's `data` is `{ user: UserPublic }`. But `GET /api/auth/me` does `setUser(data.data)` directly as a bare `UserPublic` (`src/hooks/use-auth.ts`). **Login and `/me` have different response shapes for the same object today** — the backend should pick one and the frontend should be reconciled, or the backend should deliberately keep them different and this doc reflects that as-is.
> 2. The patient registration form collects `dob: Date` and sends it as `dob` (`'yyyy-MM-dd'`) in the POST body, but `RegisterPatientRequest` in `src/types/index.ts` has no `dob`/`dateOfBirth` field. The actual body sent (including `dob`) is documented below since that's what a real backend must accept.
> 3. Nurse registration step 2 lets the applicant pick 3 documents (Aadhaar/certificate/photo) via file input, held in local React state — but `POST /api/auth/register` only ever sends JSON; the files are **never** attached (no multipart, no separate call). Document upload is UI-only today.
> 4. The public services catalog reads a hardcoded array (`HEALTHCARE_SERVICES` in `src/lib/constants.ts`) — there is **no live fetch** for services today. The two service GET endpoints below are inferred from the `ServicePublic` type and admin create/update schemas.
> 5. `forgotPasswordSchema`/`verifyOtpSchema`/`resetPasswordSchema` exist in validators and the login page links to `/forgot-password`, but no such route/endpoint is ever called — **not included** below.
> 6. "Continue with Google" is a full-page redirect, not a fetch — documented as a plain GET redirect entry point.

### 3.1 `POST /api/auth/login`

Authenticate with email/password; sets httpOnly session cookie(s) on success.

- **Auth:** public
- **Request body:**
  ```json
  { "email": "jane.doe@example.com", "password": "Str0ngP@ss!" }
  ```
  (`loginSchema`: email format/max 255; password just required, no complexity check on login.)
- **Success response** — `{ user: UserPublic }`, NOT a bare `UserPublic` (contrast with `/api/auth/me`):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "publicId": "usr_8f3a1c",
        "email": "jane.doe@example.com",
        "phone": "+919812345678",
        "fullName": "Jane Doe",
        "role": "PATIENT",
        "status": "ACTIVE",
        "emailVerified": true,
        "avatarUrl": null,
        "lastLoginAt": "2026-08-20T10:15:00Z",
        "createdAt": "2026-01-05T09:00:00Z"
      }
    },
    "meta": null,
    "error": null
  }
  ```
- **Errors:** `401 UNAUTHORIZED`/`INVALID_CREDENTIALS` for bad credentials; `429 RATE_LIMITED` after 5 attempts/min.
- **Source:** `src/app/(auth)/login/page.tsx`, `src/lib/validators/index.ts`, `src/types/index.ts`

### 3.2 `POST /api/auth/register`

Register either a Patient or a Nurse — same endpoint, distinguished by `role` in the body. Nurse accounts start pending admin review.

- **Auth:** public
- **Request body (Patient):**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+919812345678",
    "password": "Str0ngP@ss!1",
    "dob": "1990-04-12",
    "address": "12 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "role": "PATIENT"
  }
  ```
  Note: `dob` is sent by the page though `RegisterPatientRequest` in `types/index.ts` omits it (see discrepancy #2 above) — the backend must accept it regardless.
- **Request body (Nurse):**
  ```json
  {
    "fullName": "Asha Kumar",
    "email": "asha.kumar@example.com",
    "phone": "+919876543210",
    "password": "Str0ngP@ss!1",
    "gender": "FEMALE",
    "dateOfBirth": "1992-07-01",
    "address": "45 Park Street",
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": "5 years",
    "qualifications": "B.Sc Nursing",
    "certifications": "ICU Care Certified",
    "preferredContact": "whatsapp",
    "role": "NURSE"
  }
  ```
  Password (both roles): 8–128 chars, requires upper/lower/digit/special char. Nurse document files picked in the UI are **not** sent in this request (see discrepancy #3).
- **Success response:** page only checks `data.success` — most likely the created `UserPublic` (nurse `status` = `PENDING_VERIFICATION`/`PENDING_APPROVAL`), unconfirmed by frontend usage.
- **Errors:** `409 DUPLICATE_EMAIL`; `422 VALIDATION_ERROR`; `429 RATE_LIMITED` (3/hour).
- **Source:** `src/app/(auth)/register/patient/page.tsx`, `src/app/(auth)/register/nurse/page.tsx`, `src/lib/validators/index.ts`, `src/lib/schemas/auth.schema.ts`, `src/types/index.ts`

### 3.3 `GET /api/auth/me`

Get the currently authenticated user from the session cookie.

- **Auth:** any authenticated user
- **Success response** — bare `UserPublic` (`use-auth.ts` does `setUser(data.data)` directly):
  ```json
  {
    "success": true,
    "data": {
      "publicId": "usr_8f3a1c",
      "email": "jane.doe@example.com",
      "phone": "+919812345678",
      "fullName": "Jane Doe",
      "role": "PATIENT",
      "status": "ACTIVE",
      "emailVerified": true,
      "avatarUrl": null,
      "lastLoginAt": "2026-08-20T10:15:00Z",
      "createdAt": "2026-01-05T09:00:00Z"
    },
    "meta": null,
    "error": null
  }
  ```
- **Errors:** `401 UNAUTHORIZED` → frontend sets `user = null`. Network failure falls back to a client-only mock session (frontend resilience only, not backend behavior).
- **Source:** `src/hooks/use-auth.ts`

### 3.4 `POST /api/auth/logout`

End the current session (clear auth cookies).

- **Auth:** any authenticated user
- **Request body:** none
- **Success response:** not read by the caller — hook clears local state and redirects to `/login` regardless of outcome; errors are swallowed.
- **Source:** `src/hooks/use-auth.ts`

### 3.5 `GET /api/auth/google`

Google OAuth entry point. Login page does a full-page browser redirect here (not a `fetch`), implying a server-side OAuth flow: redirect to Google → callback → set session cookie → redirect back into the app.

- **Auth:** public
- **Source:** `src/app/(auth)/login/page.tsx`

### 3.6 `POST /api/v1/contacts`

Submit the public contact-us form.

- **Auth:** public
- **Request body:**
  ```json
  {
    "name": "Ravi Shah",
    "email": "ravi.shah@example.com",
    "phone": "9876543210",
    "subject": "Question about pricing",
    "message": "I'd like to know the pricing for elder care support in Pune."
  }
  ```
  (`contactSchema`: name 2–100, email valid/≤255, phone optional 10–15 digits, subject 3–200, message 10–5000.)
- **Success response** (`ContactInquiryPublic`, not read by the page):
  ```json
  {
    "success": true,
    "data": {
      "publicId": "cti_4b2e9f",
      "name": "Ravi Shah",
      "email": "ravi.shah@example.com",
      "phone": "9876543210",
      "subject": "Question about pricing",
      "message": "I'd like to know the pricing for elder care support in Pune.",
      "status": "NEW",
      "createdAt": "2026-08-24T12:00:00Z"
    },
    "meta": null,
    "error": null
  }
  ```
- **Errors:** page swallows all errors silently client-side — still expect `400`/`422 VALIDATION_ERROR` server-side.
- **Source:** `src/app/(public)/contact/page.tsx`, `src/lib/schemas/contact.schema.ts`, `src/lib/validators/index.ts`, `src/types/index.ts`

### 3.7 `POST /api/v1/waitlist`

Join the pre-launch waitlist from the landing page CTA.

- **Auth:** public
- **Request body:** page always sends `{ "email": "...", "source": "landing" }`; schema additionally allows optional `name`/`phone`/`source` (max 50 chars).
  ```json
  { "email": "interested.user@example.com", "source": "landing" }
  ```
- **Success response** (`WaitlistEntryPublic`, fire-and-forget, not read by caller):
  ```json
  {
    "success": true,
    "data": {
      "publicId": "wl_1a2b3c",
      "email": "interested.user@example.com",
      "name": null,
      "phone": null,
      "source": "landing",
      "notified": false,
      "createdAt": "2026-08-24T12:00:00Z"
    },
    "meta": null,
    "error": null
  }
  ```
- **Errors:** errors silently swallowed client-side ("Silently fail for MVP") — still expect `409 CONFLICT` on duplicate email, `422` on invalid email server-side.
- **Source:** `src/app/(public)/page.tsx`, `src/lib/validators/index.ts`, `src/types/index.ts`

### 3.8 `GET /api/v1/services` — *inferred*

List active public services for the catalog page. **Inferred** from the `ServicePublic` type and admin create/update schemas — the actual page currently reads a hardcoded array (`HEALTHCARE_SERVICES` in `src/lib/constants.ts`); no live call exists yet.

- **Auth:** public
- **Query params:** likely `page`/`limit` per the standard pagination convention; possibly `isActive` (default `true` for public). Unconfirmed.
- **Success response** (`ServicePublic[]`, paginated):
  ```json
  {
    "success": true,
    "data": [
      {
        "publicId": "svc_home-nursing",
        "name": "Home Nursing",
        "slug": "home-nursing",
        "description": "Our verified and experienced nurses provide comprehensive healthcare services right at your home...",
        "shortDesc": "Professional nursing care delivered to your doorstep",
        "heroImage": null,
        "icon": "Heart",
        "features": ["24/7 nursing care availability", "Wound care and dressing"],
        "pricingRange": "₹800 – ₹3,000/day",
        "isActive": true,
        "seoTitle": null,
        "seoDescription": null
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 7, "totalPages": 1 },
    "error": null
  }
  ```
- **Source:** `src/app/(public)/services/page.tsx`, `src/lib/constants.ts`, `src/types/index.ts`, `src/lib/validators/index.ts`

### 3.9 `GET /api/v1/services/{slug}` — *inferred*

Get one public service's detail by slug. Same caveat as above — the actual page resolves against the hardcoded array, not a live fetch.

- **Auth:** public
- **Path params:** `slug` — lowercase-hyphenated, e.g. `home-nursing`, matches `^[a-z0-9-]+$`.
- **Success response:** `ServicePublic` (same shape as list item).
- **Errors:** `404 NOT_FOUND` when slug not found (frontend calls `notFound()`).
- **Source:** `src/app/(public)/services/[slug]/page.tsx`, `src/lib/constants.ts`, `src/types/index.ts`, `src/lib/validators/index.ts`

---

## 4. Admin Portal (role `ADMIN`)

All requests use `apiFetch` with `credentials: "include"`. **All list/search operations for nurses, patients, services, waitlist, and contacts funnel through one generic endpoint**, `GET /api/v1/search?entity=...`, used identically by `useNurses.ts`, `usePatients.ts`, `useServices.ts`, `useWaitlist.ts`, `useContacts.ts`.

### 4.1 `GET /api/v1/search` — generic entity search (documented once)

- **Auth:** `ADMIN`
- **Query params (common):** `entity` (required: `nurses` | `patients` | `services` | `contacts` | `waitlist`), `q` (optional debounced free-text search), `status` (optional, nurses & contacts only), `page` (default 1), `limit` (default 20), `sortBy`, `sortOrder` (`asc`|`desc`)
- **Response envelope:** `{ success, data: T[], meta: { page, limit, total, totalPages } }` where `T` depends on `entity`:

#### `entity=nurses`
- Query defaults: `status` ∈ `PENDING`|`APPROVED`|`REJECTED`; `sortBy=createdAt`, `sortOrder=desc`
- Response item (`NurseEntry` — narrower than full `NurseProfilePublic`):
  ```json
  {
    "publicId": "nur_7c1d2e",
    "verificationStatus": "PENDING",
    "experience": "5 years",
    "user": {
      "publicId": "usr_9f0a1b",
      "email": "asha.kumar@example.com",
      "fullName": "Asha Kumar",
      "phone": "+919876543210",
      "status": "PENDING_VERIFICATION",
      "createdAt": "2026-08-01T09:00:00Z"
    }
  }
  ```
- **Source:** `src/features/admin/useNurses.ts`, `src/components/web/admin/nurses/WebAdminNurses.tsx`

#### `entity=patients`
- Response item (`PatientEntry`, read-only view, no actions):
  ```json
  {
    "publicId": "pat_3e4f5a",
    "registrationStatus": "ACTIVE",
    "user": { "publicId": "usr_1a2b3c", "email": "jane.doe@example.com", "fullName": "Jane Doe", "phone": "+919812345678", "createdAt": "2026-01-05T09:00:00Z" }
  }
  ```
- **Source:** `src/features/admin/usePatients.ts`, `src/components/web/admin/patients/WebAdminPatients.tsx`

#### `entity=services`
- Query defaults: `sortBy=name`, `sortOrder=asc`
- Response item (`ServiceEntry`):
  ```json
  { "publicId": "svc_home-nursing", "name": "Home Nursing", "slug": "home-nursing", "shortDesc": "Professional nursing care delivered to your doorstep", "isActive": true, "pricingRange": "₹800 – ₹3,000/day", "createdAt": "2026-01-01T00:00:00Z" }
  ```
- **Source:** `src/features/admin/useServices.ts`, `src/components/web/admin/services/WebAdminServices.tsx`

#### `entity=waitlist`
- Response item (`WaitlistEntry`, matches `WaitlistEntryPublic`):
  ```json
  { "publicId": "wl_1a2b3c", "email": "interested.user@example.com", "name": null, "phone": null, "source": "landing", "notified": false, "createdAt": "2026-08-20T10:00:00Z" }
  ```
- **Source:** `src/features/admin/useWaitlist.ts`, `src/components/web/admin/waitlist/WebAdminWaitlist.tsx`

  > CSV export is done 100% client-side from already-fetched list data — **no dedicated export API call exists**; do not build a server export endpoint unless a full-dataset export is explicitly needed.

#### `entity=contacts`
- Query: `status` ∈ `NEW`|`READ`|`REPLIED`|`ARCHIVED`
- Response item (`ContactEntry`, matches `ContactInquiryPublic`):
  ```json
  { "publicId": "cti_4b2e9f", "name": "Ravi Shah", "email": "ravi.shah@example.com", "phone": "9876543210", "subject": "Question about pricing", "message": "...", "status": "NEW", "createdAt": "2026-08-24T12:00:00Z" }
  ```
- **Source:** `src/features/admin/useContacts.ts`, `src/components/web/admin/contacts/WebAdminContacts.tsx`

### 4.2 `GET /api/v1/admin/dashboard`

Fetch admin dashboard summary stats (shown on both web and mobile admin home screens).

- **Auth:** `ADMIN`
- **Success response:**
  ```json
  {
    "success": true,
    "data": {
      "totalPatients": 214,
      "totalNurses": 58,
      "pendingVerifications": 6,
      "waitlistCount": 340,
      "newContacts": 3,
      "recentActivity": []
    },
    "meta": null,
    "error": null
  }
  ```
  `recentActivity: AuditLogPublic[]` is declared in `DashboardStats` but not currently destructured/rendered by either dashboard component — include it for completeness, flagged as unused-by-UI today.
- **Source:** `src/components/web/admin/WebAdminDashboard.tsx`, `src/components/mobile/admin/MobileAdminDashboard.tsx`, `src/types/index.ts` (`DashboardStats`)

### 4.3 `POST /api/v1/admin/nurses/{publicId}/approve`

Approve a pending nurse's verification (button only shown when `verificationStatus === "PENDING"`).

- **Auth:** `ADMIN`
- **Path params:** `publicId`
- **Request body:** none
- **Success response:** likely the updated nurse row or `{ success: true }` — frontend just refetches the list after the call.
- **Errors:** `404 NOT_FOUND` if not found/not owned; `409 CONFLICT` if not in `PENDING` state.
- **Source:** `src/features/admin/useNurses.ts` (`handleAction`), `src/components/web/admin/nurses/WebAdminNurses.tsx`

### 4.4 `POST /api/v1/admin/nurses/{publicId}/reject`

Same pattern as approve — only the URL segment differs. No `suspend` action exists anywhere in the frontend code; only `approve`/`reject` were found.

- **Auth:** `ADMIN`
- **Path params:** `publicId`
- **Request body:** none
- **Success response:** likely the updated nurse row or `{ success: true }`.
- **Errors:** `404 NOT_FOUND`; `409 CONFLICT` if not in a rejectable state.
- **Source:** same as 4.3

### 4.5 `GET /api/v1/admin/nurses/{publicId}` — *inferred*

Fetch full nurse profile including documents, for a detail/verification review view. **Not observed in any fetch call** — no admin nurse-detail page currently exists in the frontend routes — but justified by the existence of `NurseProfilePublic`/`NurseDocumentPublic` types with document-verification fields.

- **Auth:** `ADMIN`
- **Path params:** `publicId`
- **Success response** (`NurseProfilePublic`):
  ```json
  {
    "success": true,
    "data": {
      "publicId": "nur_7c1d2e",
      "user": { "publicId": "usr_9f0a1b", "email": "asha.kumar@example.com", "phone": "+919876543210", "fullName": "Asha Kumar", "role": "NURSE", "status": "PENDING_VERIFICATION", "emailVerified": false, "avatarUrl": null, "lastLoginAt": null, "createdAt": "2026-08-01T09:00:00Z" },
      "gender": "FEMALE",
      "dateOfBirth": "1992-07-01",
      "address": "45 Park Street",
      "city": "Kolkata",
      "state": "West Bengal",
      "experience": "5 years",
      "qualifications": ["B.Sc Nursing"],
      "certifications": ["ICU Care Certified"],
      "verificationStatus": "PENDING",
      "preferredContact": "whatsapp",
      "documents": [
        { "publicId": "doc_1", "type": "AADHAAR", "fileName": "aadhaar.pdf", "fileUrl": "https://.../aadhaar.pdf", "verified": false, "createdAt": "2026-08-01T09:05:00Z" }
      ],
      "createdAt": "2026-08-01T09:00:00Z"
    },
    "meta": null,
    "error": null
  }
  ```
- **Source:** `src/types/index.ts` (`NurseProfilePublic`, `NurseDocumentPublic`) — inferred, no page/hook currently calls this.

### 4.6 Services CRUD — *all inferred, buttons unwired*

`WebAdminServices.tsx` renders "Add Service" plus per-card Edit/Toggle/Delete buttons, but **none have `onClick` handlers wired** — they are visual-only stubs today. The endpoints below are inferred from the `ServicePublic` type shape and standard REST convention; **not confirmed by any actual fetch call.**

| Method | Path | Summary |
|---|---|---|
| `POST` | `/api/v1/admin/services` | Create a new service |
| `PATCH` | `/api/v1/admin/services/{publicId}` | Edit an existing service |
| `PATCH` | `/api/v1/admin/services/{publicId}/toggle` | Toggle `isActive` (could alternatively be folded into the generic PATCH above) |
| `DELETE` | `/api/v1/admin/services/{publicId}` | Delete a service |

- **Auth:** `ADMIN` (all)
- **Create request body:**
  ```json
  {
    "name": "Home Nursing", "slug": "home-nursing", "description": "...", "shortDesc": "...",
    "heroImage": null, "icon": "Heart", "features": ["24/7 nursing care"], "pricingRange": "₹800 – ₹3,000/day",
    "isActive": true, "seoTitle": null, "seoDescription": null
  }
  ```
- **Create/edit success response:** created/updated `ServicePublic` object.
- **Toggle success response:** `{ "publicId": "svc_home-nursing", "isActive": false }` or full updated `ServicePublic`.
- **Delete success response:** `{ "success": true }`.
- **Source:** `src/components/web/admin/services/WebAdminServices.tsx` (all four buttons present, none wired), `src/types/index.ts` (`ServicePublic`)

### 4.7 `PATCH /api/v1/admin/contacts/{publicId}/status` — *inferred*

Update a contact inquiry's status (e.g. `NEW → READ` on open, or `→ REPLIED`/`ARCHIVED`). The detail panel displays full inquiry content and status badges implying a status-transition workflow, but clicking a row only sets local state (`setSelectedContact`) today — **no apiFetch call exists yet.**

- **Auth:** `ADMIN`
- **Path params:** `publicId`
- **Request body:** `{ "status": "READ" }` (one of `NEW`|`READ`|`REPLIED`|`ARCHIVED`)
- **Success response:** updated `ContactInquiryPublic`.
- **Source:** `src/components/web/admin/contacts/WebAdminContacts.tsx`, `src/features/admin/useContacts.ts`

---

## 5. Super Admin Portal (platform governance, role `SUPER_ADMIN`)

### 5.1 `GET /api/v1/admin/dashboard` (super admin variant)

- **Auth:** `SUPER_ADMIN`, `ADMIN`
- **Success response:** superset of the admin `DashboardStats` type — both Web/MobileSuperAdminDashboard components destructure `stats.totalAdmins` and `stats.totalAuditLogs`, which are **not declared** on the shared `DashboardStats` type but must be present in the real payload:
  ```json
  {
    "success": true,
    "data": {
      "totalPatients": 214, "totalNurses": 58, "totalAdmins": 4,
      "pendingVerifications": 6, "waitlistCount": 340, "newContacts": 3,
      "totalAuditLogs": 1820, "recentActivity": []
    },
    "meta": null, "error": null
  }
  ```
- **Source:** `src/components/web/super-admin/WebSuperAdminDashboard.tsx`, `src/components/mobile/super-admin/MobileSuperAdminDashboard.tsx`, `src/types/index.ts` (`DashboardStats`)

### 5.2 `GET /api/v1/admin/admins`

List/search admin accounts (`ADMIN` and `SUPER_ADMIN` role users).

- **Auth:** `SUPER_ADMIN`
- **Query params:** `q` (debounced 400ms free-text on name/email). **No `page`/`limit` sent** — response consumed as a flat array (`data.data || []`), not paginated, though the envelope may still carry an unused `meta`.
- **Success response** (`AdminEntry[]`):
  ```json
  { "success": true, "data": [ { "publicId": "adm_1a2b", "email": "ops@mendyr.app", "fullName": "Ops Admin", "role": "ADMIN", "status": "ACTIVE", "createdAt": "2026-02-01T00:00:00Z" } ], "meta": null, "error": null }
  ```
- **Source:** `src/features/super-admin/useAdmins.ts`, `src/components/web/super-admin/admins/WebSuperAdminAdmins.tsx`

### 5.3 `POST /api/v1/admin/admins`

Create a new admin (or super-admin) account.

- **Auth:** `SUPER_ADMIN`
- **Request body:**
  ```json
  { "fullName": "Ops Admin", "email": "ops@mendyr.app", "password": "Str0ngP@ss!1", "role": "ADMIN" }
  ```
- **Success response:** likely the created `AdminEntry` (not directly consumed — frontend closes the modal and re-fetches the list).
- **Errors:** `409 DUPLICATE_EMAIL`; `400`/`422 VALIDATION_ERROR` (weak password, invalid email/role) — not explicitly handled client-side (bare `catch`), should be surfaced via the standard error envelope.
- **Source:** `src/features/super-admin/useAdmins.ts`, `src/components/web/super-admin/admins/WebSuperAdminAdmins.tsx`

### 5.4 `POST /api/v1/admin/admins/{publicId}/suspend`

Toggle an admin account's suspension state — **one endpoint serves both suspend and reactivate**, based on the account's current status (the button label/icon toggles client-side; there is no separate "reactivate" endpoint).

- **Auth:** `SUPER_ADMIN`
- **Path params:** `publicId`
- **Success response:** not consumed beyond triggering a re-fetch; likely the updated `AdminEntry` or a bare success ack. Backend should toggle between `ACTIVE`/`SUSPENDED` based on current state.
- **Source:** `src/features/super-admin/useAdmins.ts`, `src/components/web/super-admin/admins/WebSuperAdminAdmins.tsx`

### 5.5 `GET /api/v1/admin/audit-logs`

List/search platform audit log entries with pagination.

- **Auth:** `SUPER_ADMIN`
- **Query params:** `q` (debounced 400ms), `page` (default 1), `limit` (fixed at 30 from this screen)
- **Success response** (`AuditEntry[]`):
  ```json
  {
    "success": true,
    "data": [
      { "id": "log_9f8e7d", "actorName": "Ops Admin", "actorEmail": "ops@mendyr.app", "action": "UPDATE", "resource": "nurse", "resourceId": "nur_7c1d2e", "ipAddress": "203.0.113.5", "createdAt": "2026-08-23T14:20:00Z" }
    ],
    "meta": { "page": 1, "limit": 30, "total": 1820, "totalPages": 61 },
    "error": null
  }
  ```
  The richer `AuditLogPublic` type also includes `oldValue`/`newValue` (`unknown | null`), unused by this list view but safe (and encouraged) to include in the row payload. Known action values in the UI color map: `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT` (not necessarily exhaustive).
- **Source:** `src/features/super-admin/useAuditLogs.ts`, `src/types/index.ts` (`AuditLogPublic`)

### 5.6 `GET /api/v1/admin/roles` — *inferred, currently dead*

List roles with their permission sets. **Not currently called** — the live Roles screen renders a hardcoded `mockRoles` array from `src/features/super-admin/rolesData.ts` instead of fetching; no `useRoles` hook exists.

- **Auth:** `SUPER_ADMIN`
- **Success response** (`RolePublic[]`):
  ```json
  {
    "success": true,
    "data": [
      { "publicId": "role_admin", "name": "Admin", "slug": "admin", "description": "Manages nurses, patients, services", "hierarchy": 1, "isSystem": true, "permissions": [ { "publicId": "perm_1", "resource": "nurse", "action": "approve", "description": null } ] }
    ],
    "meta": null, "error": null
  }
  ```
  The mock data implies each role card also wants a computed **permissions count** and **users count** (`permissions: number, users: number` in the mock) — the real endpoint should either return the full permission array (frontend counts `.length`) plus a separate user-count aggregate, or pre-aggregate both numbers server-side.
- **Source:** `src/features/super-admin/rolesData.ts`, `src/components/web/super-admin/roles/WebSuperAdminRoles.tsx`, `src/types/index.ts` (`RolePublic`)

### 5.7 `GET /api/v1/admin/permissions` — *inferred, currently a dead link*

List all available permissions in the system. There is **no dedicated page** for `/super-admin/permissions` despite the dashboard linking to it, and **no fetch call exists anywhere** in the codebase — this is speculative/lowest-confidence.

- **Auth:** `SUPER_ADMIN`
- **Success response** (`PermissionPublic[]`):
  ```json
  { "success": true, "data": [ { "publicId": "perm_1", "resource": "nurse", "action": "approve", "description": null } ], "meta": null, "error": null }
  ```
- **Source:** `src/components/web/super-admin/WebSuperAdminDashboard.tsx` (link only, no page), `src/types/index.ts` (`PermissionPublic`)

### 5.8 `PUT /api/v1/admin/settings`

Update global platform settings (site config, feature flags, security thresholds).

- **Auth:** `SUPER_ADMIN`
- **Request body:**
  ```json
  {
    "siteName": "Mendyr",
    "supportEmail": "support@mendyr.app",
    "launchDate": "2026-11-01",
    "maintenanceMode": false,
    "registrationEnabled": true,
    "nurseRegistrationEnabled": true,
    "maxLoginAttempts": "5",
    "sessionTimeout": "30"
  }
  ```
  `maxLoginAttempts` and `sessionTimeout` are sent as **strings** (bound directly from `<input type="number">`) — backend should coerce/validate as integers.
- **Success response:** not consumed by the frontend (only flips a local "Saved!" UI state) — likely the updated settings object or a bare success ack.
- **Source:** `src/components/web/super-admin/settings/WebSuperAdminSettings.tsx`, `src/components/mobile/super-admin/settings/MobileSuperAdminSettings.tsx`

> **Note:** no corresponding `GET /api/v1/admin/settings` is called anywhere — the settings form is initialized purely from hardcoded local defaults. Recommend the backend still expose `GET` for correctness even though the frontend doesn't call it today (see §7 gaps).

---

## 6. Nurse Portal (role `NURSE`)

> **Frontend state note:** this entire domain is currently **mock-only**. `nurseSlice.ts` seeds all Redux state from hardcoded arrays (`INITIAL_MOCK_APPOINTMENTS`, `INITIAL_MOCK_TRANSACTIONS`, `INITIAL_MOCK_THREADS`) and `useAvailability.ts` uses local `useState` with zero persistence. There is **no fetch/axios call anywhere** in the nurse feature code. Every endpoint below is inferred from Redux actions/selectors and the relevant TypeScript types (`AppointmentPublic`, `CareNotePublic`, `EarningTransactionPublic`, `NurseEarningsSummary`, `NurseDocumentPublic`, `NurseProfilePublic`).
>
> `AppointmentStatus` has 8 values (`PENDING_ACCEPTANCE`, `REQUESTED`, `ACCEPTED`, `CONFIRMED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) but `nurseSlice` reducers only ever set `CONFIRMED`/`CANCELLED`/`IN_PROGRESS`/`COMPLETED`, while `WebNurseAppointments.tsx` branches its buttons on `PENDING_ACCEPTANCE`/`ACCEPTED` (never actually produced by the slice). **Recommend the backend standardize on:** `REQUESTED → ACCEPTED/REJECTED → CONFIRMED → IN_PROGRESS → COMPLETED`, with `CANCELLED` as a terminal decline state, and have the frontend's status branching reconciled against it.

### 6.1 `GET /api/v1/nurse/appointments`

List the logged-in nurse's appointments (all statuses); frontend filters client-side into pending/upcoming/active/completed/rejected tabs.

- **Auth:** `NURSE`
- **Query params:** `status?`, `page?`, `limit?`
- **Success response** (`AppointmentPublic[]`):
  ```json
  {
    "success": true,
    "data": [
      {
        "publicId": "apt_1a2b3c", "patientName": "Jane Doe", "patientAge": 68, "patientGender": "FEMALE",
        "patientPhone": "+919812345678", "serviceName": "Home Nursing", "serviceSlug": "home-nursing",
        "date": "2026-08-26", "timeSlot": "09:00 AM - 01:00 PM", "durationHours": 4,
        "location": { "address": "12 MG Road", "city": "Bengaluru", "state": "Karnataka", "distanceKm": 3.2 },
        "payoutAmount": 1200, "status": "REQUESTED", "specialInstructions": "Ring the doorbell twice",
        "createdAt": "2026-08-24T08:00:00Z"
      }
    ],
    "meta": null, "error": null
  }
  ```
- **Source:** `src/store/slices/nurseSlice.ts`, `src/features/nurse/useAppointments.ts`, `src/components/web/nurse/appointments/WebNurseAppointments.tsx`

### 6.2 `POST /api/v1/nurse/appointments/{publicId}/accept`

Nurse accepts a pending appointment request, moving it to `CONFIRMED`.

- **Auth:** `NURSE`
- **Path params:** `publicId`
- **Success response:** `AppointmentPublic` (`status: "CONFIRMED"`)
- **Errors:** `404 NOT_FOUND` if not found/not owned; `409 CONFLICT` if not in `REQUESTED`/`PENDING_ACCEPTANCE` state.
- **Source:** `src/store/slices/nurseSlice.ts` (`acceptAppointmentRequest`), `src/features/nurse/useAppointments.ts`, `src/components/web/nurse/appointments/WebNurseAppointments.tsx`

### 6.3 `POST /api/v1/nurse/appointments/{publicId}/reject`

Nurse declines a pending appointment request with a reason, moving it to `CANCELLED`/`REJECTED`.

- **Auth:** `NURSE`
- **Path params:** `publicId`
- **Request body:**
  ```json
  { "reason": "Schedule conflict" }
  ```
  (one of `Schedule conflict` | `Location too far from my zone` | `Outside my clinical expertise` | free text when "Other")
- **Success response:** `AppointmentPublic` (`status: "CANCELLED"`/`"REJECTED"`, `rejectionReason` set)
- **Errors:** `404 NOT_FOUND`; `409 CONFLICT` if not in a rejectable state.
- **Source:** `src/store/slices/nurseSlice.ts` (`rejectAppointmentRequest`), `src/features/nurse/useAppointments.ts`, `src/components/web/nurse/appointments/WebNurseAppointments.tsx`

### 6.4 `POST /api/v1/nurse/appointments/{publicId}/check-in`

Nurse starts the visit / checks in at the patient location → `IN_PROGRESS`, records `checkInTime`.

- **Auth:** `NURSE`
- **Path params:** `publicId`
- **Success response:** `AppointmentPublic` (`status: "IN_PROGRESS"`, `checkInTime` set)
- **Errors:** `409 CONFLICT` if appointment not `CONFIRMED`/`ACCEPTED`.
- **Source:** `src/store/slices/nurseSlice.ts` (`startCareVisit`), `src/features/nurse/useAppointments.ts`, `src/components/web/nurse/appointments/WebNurseAppointments.tsx`

### 6.5 `POST /api/v1/nurse/appointments/{publicId}/check-out`

Nurse completes the visit: submits clinical care note + vitals + medications → `COMPLETED`, records `checkOutTime`, and creates a paid earning transaction.

- **Auth:** `NURSE`
- **Path params:** `publicId`
- **Request body:**
  ```json
  {
    "notes": "Patient stable, wound dressing changed, no signs of infection.",
    "vitals": { "bloodPressure": "128/82", "heartRate": 76, "temperature": 98.4, "oxygenSaturation": 97 },
    "medicationsAdministered": ["Paracetamol 500mg"]
  }
  ```
- **Success response:** `AppointmentPublic` (`status: "COMPLETED"`, `checkOutTime` set, `careNotes` appended) and/or the created `EarningTransactionPublic`.
- **Errors:** `409 CONFLICT` if appointment not `IN_PROGRESS`.
- **Source:** `src/store/slices/nurseSlice.ts` (`completeCareVisit`), `src/features/nurse/useAppointments.ts`, `src/types/index.ts` (`CareNotePublic`), `src/components/web/nurse/appointments/WebNurseAppointments.tsx`

### 6.6 `POST /api/v1/nurse/appointments/{publicId}/care-notes`

Add a standalone care note to an appointment (covers logging notes separately from checkout).

- **Auth:** `NURSE`
- **Path params:** `publicId`
- **Request body:** `CareNotePublic` minus `id`/`timestamp`/`authorName` (server-generated).
- **Success response:** `CareNotePublic`
- **Source:** `src/types/index.ts` (`CareNotePublic`), `src/store/slices/nurseSlice.ts`

### 6.7 `GET /api/v1/nurse/availability`

Get the nurse's weekly availability schedule, shift preferences, and on-duty flag.

- **Auth:** `NURSE`
- **Success response** (`NurseAvailability`):
  ```json
  {
    "success": true,
    "data": {
      "days": [ { "day": "Monday", "active": true, "hours": "09:00-17:00" } ],
      "shiftPreferences": { "morning": true, "afternoon": true, "evening": false, "night": false },
      "onDutyNow": true
    },
    "meta": null, "error": null
  }
  ```
- **Source:** `src/store/slices/nurseSlice.ts` (`NurseAvailability` interface, initial state, `selectNurseAvailability`)

### 6.8 `PUT /api/v1/nurse/availability`

Update the nurse's full weekly availability schedule.

- **Auth:** `NURSE`
- **Request body:** `Partial<NurseAvailability>`, e.g. `{ "days": [{ "day": "Monday", "active": true, "hours": "09:00-17:00" }], "shiftPreferences": { ... } }`. **Note:** the frontend today updates one day at a time (`updateAvailabilityDay`), and a separate screen (`WebNurseAvailability.tsx`/`useAvailability.ts`) uses an **alternate 7-day × 4-named-slot boolean grid** (Morning/Afternoon/Evening/Night) with an unwired "Save Availability" button — the backend team should pick one canonical representation and reconcile the frontend.
- **Success response:** `NurseAvailability`
- **Source:** `src/store/slices/nurseSlice.ts` (`updateAvailabilityDay`), `src/features/nurse/useAvailability.ts`, `src/components/web/nurse/availability/WebNurseAvailability.tsx`

### 6.9 `POST /api/v1/nurse/status/toggle`

Toggle nurse's on-duty/online status (available for new bookings now vs offline).

- **Auth:** `NURSE`
- **Success response:** `{ "onDutyNow": false }`
- **Source:** `src/store/slices/nurseSlice.ts` (`toggleOnDutyStatus`)

### 6.10 `GET /api/v1/nurse/earnings/summary`

Aggregate earnings dashboard.

- **Auth:** `NURSE`
- **Success response** (`NurseEarningsSummary`):
  ```json
  {
    "success": true,
    "data": {
      "todayEarnings": 1200, "weekEarnings": 6400, "monthEarnings": 24800, "totalEarnings": 148000,
      "pendingPayout": 3200, "completedVisitsCount": 42,
      "transactions": [ { "id": "txn_1", "appointmentId": "apt_1a2b3c", "patientName": "Jane Doe", "serviceName": "Home Nursing", "date": "2026-08-24", "amount": 1200, "status": "PAID", "paymentMethod": "UPI" } ]
    },
    "meta": null, "error": null
  }
  ```
  Currently computed client-side from appointments + transactions (`selectNurseEarningsSummary`) — should be server-computed.
- **Source:** `src/types/index.ts` (`NurseEarningsSummary`), `src/store/slices/nurseSlice.ts`, `src/components/web/nurse/earnings/WebNurseEarnings.tsx`

### 6.11 `GET /api/v1/nurse/earnings/transactions`

Paginated transaction history.

- **Auth:** `NURSE`
- **Query params:** `page?`, `limit?`, `status?` (`PAID`|`PROCESSING`|`PENDING`)
- **Success response** (`EarningTransactionPublic[]`): see example under 6.10.
- **Source:** `src/types/index.ts` (`EarningTransactionPublic`), `src/store/slices/nurseSlice.ts`, `src/components/web/nurse/earnings/WebNurseEarnings.tsx`

### 6.12 `POST /api/v1/nurse/earnings/payout-request`

Request an instant/manual payout of the current `pendingPayout` balance to the connected bank account.

- **Auth:** `NURSE`
- **Request body:** none (empty stub reducer today)
- **Success response:** `{ "requested": true, "amount": 3200 }` or a new `EarningTransactionPublic` in `PROCESSING` status.
- **Source:** `src/store/slices/nurseSlice.ts` (`requestInstantPayout`), `src/components/web/nurse/earnings/WebNurseEarnings.tsx`

### 6.13 `GET /api/v1/nurse/bank-account`

Get the nurse's connected payout bank account.

- **Auth:** `NURSE`
- **Success response:**
  ```json
  { "success": true, "data": { "bankName": "HDFC Bank", "accountNumberMasked": "XXXX1234", "ifsc": "HDFC0001234", "holderName": "Asha Kumar", "verified": true }, "meta": null, "error": null }
  ```
- **Source:** `src/store/slices/nurseSlice.ts`, `src/components/web/nurse/earnings/WebNurseEarnings.tsx`

### 6.14 `PATCH /api/v1/nurse/bank-account`

Update/replace the nurse's payout bank account (triggers re-verification).

- **Auth:** `NURSE`
- **Request body:**
  ```json
  { "bankName": "ICICI Bank", "accountNumber": "000123456789", "ifsc": "ICIC0000123", "holderName": "Asha Kumar" }
  ```
- **Success response:** same shape as 6.13 (`verified: false` until re-verified).
- **Source:** `src/components/web/nurse/earnings/WebNurseEarnings.tsx` ("Change Bank Account" button, unwired), `src/store/slices/nurseSlice.ts`

### 6.15 `GET /api/v1/nurse/documents`

List the nurse's verification documents.

- **Auth:** `NURSE`
- **Success response** (`NurseDocumentPublic[]`):
  ```json
  { "success": true, "data": [ { "publicId": "doc_1", "type": "AADHAAR", "fileName": "aadhaar.pdf", "fileUrl": "https://.../aadhaar.pdf", "verified": true, "createdAt": "2026-08-01T09:05:00Z" } ], "meta": null, "error": null }
  ```
- **Source:** `src/types/index.ts` (`NurseDocumentPublic`, `NurseProfilePublic.documents`), `src/components/web/nurse/documents/WebNurseDocuments.tsx`, `src/components/mobile/nurse/documents/MobileNurseDocuments.tsx`

### 6.16 `POST /api/v1/nurse/documents`

Upload (or replace) a verification document.

- **Auth:** `NURSE`
- **Request body:** `multipart/form-data` — `type` (`AADHAAR`|`CERTIFICATE`|`PROFILE_PHOTO`|...), `file`
- **Success response:** `NurseDocumentPublic` (`verified: false`, pending review)
- **Source:** `src/components/web/nurse/documents/WebNurseDocuments.tsx` ("Upload"/"Replace" buttons, unwired), `src/components/mobile/nurse/documents/MobileNurseDocuments.tsx`

### 6.17 `GET /api/v1/nurse/messages/threads`

List the nurse's patient message threads.

- **Auth:** `NURSE`
- **Success response** (`NurseMessageThread[]`, messages may be truncated/omitted in list view):
  ```json
  {
    "success": true,
    "data": [ { "id": "thr_1", "patientName": "Jane Doe", "patientAge": 68, "patientGender": "FEMALE", "serviceName": "Home Nursing", "phone": "+919812345678", "online": true, "unreadCount": 2, "lastActive": "2026-08-24T11:50:00Z" } ],
    "meta": null, "error": null
  }
  ```
- **Source:** `src/store/slices/nurseSlice.ts` (`NurseMessageThread` interface, `INITIAL_MOCK_THREADS`, `selectNurseMessageThreads`), `src/components/web/nurse/messages/WebNurseMessages.tsx`

### 6.18 `GET /api/v1/nurse/messages/threads/{threadId}`

Get full message history for one thread; marks it read (`unreadCount` reset).

- **Auth:** `NURSE`
- **Path params:** `threadId`
- **Success response:** `NurseMessageThread` with full `messages[]`.
- **Source:** `src/components/web/nurse/messages/WebNurseMessages.tsx` (`handleSelectThread`)

### 6.19 `POST /api/v1/nurse/messages/threads/{threadId}/messages`

Send a message to a patient in a thread.

- **Auth:** `NURSE`
- **Path params:** `threadId`
- **Request body:**
  ```json
  { "text": "I'll be there at 9 AM.", "attachment": null }
  ```
- **Success response** (`NurseMessage`):
  ```json
  { "success": true, "data": { "id": "msg_1", "senderId": "nurse", "text": "I'll be there at 9 AM.", "timestamp": "2026-08-24T12:00:00Z", "status": "sent" }, "meta": null, "error": null }
  ```
- **Source:** `src/store/slices/nurseSlice.ts` (`NurseMessage` interface, `sendCareMessage`), `src/components/web/nurse/messages/WebNurseMessages.tsx`

### 6.20 `POST /api/v1/nurse/messages/threads/{threadId}/attachments`

Upload a file/image attachment to a message thread (frontend currently simulates this with `url: "#"`).

- **Auth:** `NURSE`
- **Path params:** `threadId`
- **Request body:** `multipart/form-data` — `file`
- **Success response:** `{ "type": "image", "url": "https://.../att.jpg", "name": "att.jpg" }`
- **Source:** `src/components/web/nurse/messages/WebNurseMessages.tsx` (`handleSimulateAttachment`), `src/store/slices/nurseSlice.ts`

### 6.21 `GET /api/v1/nurse/profile`

Get the nurse's full profile.

- **Auth:** `NURSE`
- **Success response:** `NurseProfilePublic` — same shape as example under 4.5.
- **Source:** `src/types/index.ts` (`NurseProfilePublic`), `src/components/web/nurse/profile/WebNurseProfile.tsx`

### 6.22 `PATCH /api/v1/nurse/profile`

Update editable profile fields; email is read-only in the UI.

- **Auth:** `NURSE`
- **Request body:**
  ```json
  { "fullName": "Asha Kumar", "phone": "+919876543210", "address": "45 Park Street", "experience": "6 years", "qualifications": "B.Sc Nursing, M.Sc Critical Care", "certifications": "ICU Care Certified" }
  ```
- **Success response:** `NurseProfilePublic`
- **Source:** `src/components/web/nurse/profile/WebNurseProfile.tsx` (unwired "Save Changes" button)

### 6.23 `GET /api/v1/nurse/verification-status`

Get onboarding/verification pipeline status and timeline.

- **Auth:** `NURSE`
- **Success response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "UNDER_REVIEW",
      "timeline": [
        { "label": "Application submitted", "description": "Registration received", "status": "completed", "date": "2026-08-01" },
        { "label": "Documents uploaded", "description": "Aadhaar, certificate, photo", "status": "completed", "date": "2026-08-02" },
        { "label": "Under review", "description": "Admin verifying credentials", "status": "current", "date": "2026-08-03" },
        { "label": "Approved", "description": "", "status": "upcoming", "date": "" }
      ]
    },
    "meta": null, "error": null
  }
  ```
- **Source:** `src/store/slices/nurseSlice.ts` (`NurseState.status`, `selectNurseStatus`), `src/components/web/nurse/status/WebNurseStatus.tsx`

### 6.24 `GET /api/v1/nurse/settings`

Get notification preference toggles and preferred contact method.

- **Auth:** `NURSE`
- **Success response:**
  ```json
  { "success": true, "data": { "notifications": { "verificationUpdates": true, "newPatientRequests": true, "scheduleReminders": true, "platformAnnouncements": false }, "contactPreference": "WhatsApp" }, "meta": null, "error": null }
  ```
- **Source:** `src/components/web/nurse/settings/WebNurseSettings.tsx` (unwired `defaultChecked` toggles)

### 6.25 `PATCH /api/v1/nurse/settings`

Update notification preferences and/or preferred contact method.

- **Auth:** `NURSE`
- **Request body:** `{ "notifications"?: {...}, "contactPreference"?: "Email"|"Phone"|"WhatsApp" }`
- **Success response:** same shape as 6.24.
- **Source:** `src/components/web/nurse/settings/WebNurseSettings.tsx`

### 6.26 `POST /api/auth/change-password`

Change the logged-in user's password (shared auth endpoint, surfaced in nurse Settings page — not nurse-specific).

- **Auth:** `NURSE`, `PATIENT`, `ADMIN` (any authenticated user)
- **Request body:**
  ```json
  { "currentPassword": "OldP@ss1", "newPassword": "NewStr0ngP@ss!", "confirmPassword": "NewStr0ngP@ss!" }
  ```
- **Success response:** `{ "success": true }`
- **Errors:** `401 UNAUTHORIZED` if `currentPassword` wrong; `400 VALIDATION_ERROR` if `newPassword`/`confirmPassword` mismatch.
- **Source:** `src/components/web/nurse/settings/WebNurseSettings.tsx` (unwired "Change Password" form)

---

## 7. Patient Portal (role `PATIENT`)

> **Frontend state note:** everything under `(dashboard)/patient/` currently renders from `src/features/patient/dashboardData.ts`, whose own comment reads: *"Temporary client-side data. Replace these exports with patient API data when the patient endpoints are available."* None of appointments, nearby providers, care plan, health summary, or emergency contact are wired to any network call (confirmed via `grep -rn "api/v1\|api/auth"` across the patient components — zero hits). Profile and Settings "Save"/"Update Password" buttons are also pure local UI state with no network call. Every endpoint below is inferred from the mock data shapes, the shared types in `src/types/index.ts`, and the conventions already implemented for other roles.

### 7.1 `POST /api/auth/register`

Register a new patient account (shared auth endpoint — see §3.2 for the full discrepancy note re: `dob`).

- **Auth:** public
- **Request body:** `RegisterPatientRequest` — see §3.2.
- **Success response:** `UserPublic` (sets httpOnly session cookie).
- **Errors:** `409` duplicate email/phone; `422` validation.
- **Source:** `src/types/index.ts` (`RegisterPatientRequest`), `src/app/(auth)/register/patient/page.tsx`

### 7.2 `GET /api/auth/me`

Used to populate patient header greeting/name/email/phone across dashboard, profile, and settings screens. See §3.3 for full spec.

- **Auth:** `PATIENT`, `NURSE`, `ADMIN`, `SUPER_ADMIN`
- **Source:** `src/hooks/use-auth.ts`, `src/components/web/patient/WebPatientDashboard.tsx`, `src/components/web/patient/WebPatientProfile.tsx`

### 7.3 `GET /api/v1/patients/me`

Get the logged-in patient's full profile (address/city/state/registrationStatus aren't on `UserPublic`).

- **Auth:** `PATIENT`
- **Success response** (`PatientProfilePublic`):
  ```json
  {
    "success": true,
    "data": {
      "publicId": "pat_3e4f5a",
      "user": { "publicId": "usr_1a2b3c", "email": "jane.doe@example.com", "phone": "+919812345678", "fullName": "Jane Doe", "role": "PATIENT", "status": "ACTIVE", "emailVerified": true, "avatarUrl": null, "lastLoginAt": "2026-08-20T10:15:00Z", "createdAt": "2026-01-05T09:00:00Z" },
      "address": "12 MG Road", "city": "Bengaluru", "state": "Karnataka",
      "registrationStatus": "ACTIVE", "createdAt": "2026-01-05T09:00:00Z"
    },
    "meta": null, "error": null
  }
  ```
- **Errors:** `401`; `404` patient profile not found.
- **Source:** `src/types/index.ts` (`PatientProfilePublic`), `src/components/web/patient/WebPatientProfile.tsx`, `src/components/mobile/patient/MobilePatientProfile.tsx`

### 7.4 `PATCH /api/v1/patients/me`

Update the logged-in patient's profile (backs the "Edit"/"Save Changes" flow, currently a no-op state toggle).

- **Auth:** `PATIENT`
- **Request body:** `{ "fullName"?, "phone"?, "address"?, "city"?, "state"? }` — `fullName`/`phone` live on `UserPublic`; `address`/`city`/`state` on `PatientProfilePublic`.
- **Success response:** updated `PatientProfilePublic`.
- **Errors:** `401`; `422` (e.g. invalid phone format).
- **Source:** `src/components/web/patient/WebPatientProfile.tsx`, `src/components/mobile/patient/MobilePatientProfile.tsx`

### 7.5 `GET /api/v1/patients/me/appointments`

List the patient's appointments (backs "Next appointment" card and "View schedule").

- **Auth:** `PATIENT`
- **Query params:** `status?` (`AppointmentStatus`), `page?`, `limit?`
- **Success response:** `AppointmentPublic[]` — same shape as §6.1 example (shared type with nurse side; some nurse-facing fields are redundant from the patient's own view).
- **Errors:** `401`
- **Source:** `src/features/patient/dashboardData.ts`, `src/types/index.ts` (`AppointmentPublic`), `src/components/web/patient/WebPatientDashboard.tsx`

### 7.6 `GET /api/v1/nurses/nearby`

Search for nearby available nurses (mock data includes Nurse/Doctor/Pharmacist, but only Nurse is backed by an actual type in this codebase — `NurseProfilePublic`; Doctor/Pharmacist appear to be UI-only placeholder categories).

- **Auth:** `PATIENT`
- **Query params:** `lat?`, `lng?`, `radiusKm?` (mock UI shows "Within 3 km"), `page?`, `limit?`
- **Success response:** array of nurse search results — `rating`/`distanceKm`/`nextAvailableSlot` have no existing type and would need to be added to `NurseProfilePublic` or a dedicated search-result shape:
  ```json
  {
    "success": true,
    "data": [ { "publicId": "nur_7c1d2e", "user": { "fullName": "Asha Kumar", "avatarUrl": null }, "qualifications": ["B.Sc Nursing"], "distanceKm": 2.4, "rating": 4.8, "nextAvailableSlot": "2026-08-26T09:00:00Z" } ],
    "meta": null, "error": null
  }
  ```
- **Errors:** `401`; `400` missing/invalid location.
- **Source:** `src/features/patient/dashboardData.ts` (`nearbyProviders`), `src/types/index.ts` (`NurseProfilePublic`), `src/components/web/patient/WebPatientDashboard.tsx`

### 7.7 `GET /api/v1/services` (patient-facing)

List active healthcare services available to book. Same endpoint as §3.8; the "Book appointment" flow needs a service to attach to the booking.

- **Auth:** `PATIENT`
- **Query params:** `isActive?` (defaults `true`)
- **Success response:** `ServicePublic[]` — see §3.8 example.
- **Source:** `src/types/index.ts` (`ServicePublic`), `src/app/(public)/services/page.tsx`, `src/features/admin/useServices.ts`

### 7.8 `POST /api/v1/appointments`

Book a new appointment/service request with a nurse (backs "Book appointment"/"Book now"/"Request delivery" — currently only sets local `bookedProviderId` state, no request sent).

- **Auth:** `PATIENT`
- **Request body:**
  ```json
  {
    "nurseId": "nur_7c1d2e", "serviceSlug": "home-nursing", "date": "2026-08-26", "timeSlot": "09:00 AM - 01:00 PM",
    "address": "12 MG Road", "city": "Bengaluru", "state": "Karnataka",
    "specialInstructions": "Ring the doorbell twice", "medicalConditions": ["Diabetes"]
  }
  ```
  (modeled on `AppointmentPublic` fields minus server-computed ones — `payoutAmount`, `status`)
- **Success response:** `AppointmentPublic` (status likely starts as `REQUESTED` or `PENDING_ACCEPTANCE` per `AppointmentStatus`).
- **Errors:** `401`; `404` nurse/service not found; `409` slot no longer available; `422` validation.
- **Source:** `src/components/web/patient/WebPatientDashboard.tsx`, `src/components/mobile/patient/MobilePatientDashboard.tsx`, `src/types/index.ts` (`AppointmentPublic`, `AppointmentStatus`)

### 7.9 `GET /api/v1/patients/me/care-plan` — *inferred, unconfirmed feature*

Get the patient's active care plan progress (title, completed/total task counts, next step). **No matching type exists** in `types/index.ts` — inferred purely from mock shape; confirm as a real feature before building.

- **Auth:** `PATIENT`
- **Success response:** `{ "title": "Post-Op Recovery Plan", "completed": 3, "total": 8, "nextStep": "Physiotherapy session on Aug 27" }` (progress % computed client-side).
- **Errors:** `401`; `404` no active care plan.
- **Source:** `src/features/patient/dashboardData.ts` (`carePlan`), `src/components/web/patient/WebPatientDashboard.tsx`

### 7.10 `GET /api/v1/patients/me/health-summary` — *inferred, unconfirmed feature*

Get the patient's latest vitals readings. **No matching type in `types/index.ts`** (`CareNotePublic.vitals` is nurse-authored, scoped to one appointment, not an aggregated patient feed) — flagged as inferred-only.

- **Auth:** `PATIENT`
- **Success response:** array of `{ "label": "Blood Pressure", "value": "128/82", "unit": "mmHg" }`, or better, a latest `CareNotePublic.vitals`-shaped object with a `recordedAt` timestamp.
- **Errors:** `401`; empty array if no readings recorded yet.
- **Source:** `src/features/patient/dashboardData.ts` (`healthSummary`), `src/types/index.ts` (`CareNotePublic`), `src/components/web/patient/WebPatientDashboard.tsx`

### 7.11 `PUT /api/v1/patients/me/emergency-contact` — *inferred, requires new fields*

Set/update the patient's emergency contact. **No field for this exists** anywhere on `PatientProfilePublic` — requires adding `emergencyContactName`/`Relationship`/`Phone` to that type, or a dedicated sub-resource (modeled here as the latter).

- **Auth:** `PATIENT`
- **Request body:** `{ "name": "Ramesh Doe", "relationship": "Son", "phone": "+919812345679" }`
- **Success response:** same shape.
- **Errors:** `401`; `422` invalid phone.
- **Source:** `src/features/patient/dashboardData.ts` (`emergencyContact`), `src/components/web/patient/WebPatientDashboard.tsx`

### 7.12 `GET /api/v1/patients/me/settings`

Get the patient's notification preferences (backs the toggles in Web/MobilePatientSettings, currently local `useState` only, `defaultChecked=true`). Inferred by analogy with the super-admin settings pattern, not from any patient-specific fetch call.

- **Auth:** `PATIENT`
- **Success response:** `{ "notifyServiceLaunches": true, "notifyPromotions": true, "notifyAccountAlerts": true }`
- **Errors:** `401`
- **Source:** `src/components/web/patient/WebPatientSettings.tsx`, `src/components/mobile/patient/MobilePatientSettings.tsx`, `src/components/mobile/super-admin/settings/MobileSuperAdminSettings.tsx`

### 7.13 `PUT /api/v1/patients/me/settings`

Update the patient's notification preferences.

- **Auth:** `PATIENT`
- **Request body:** `{ "notifyServiceLaunches"?: boolean, "notifyPromotions"?: boolean, "notifyAccountAlerts"?: boolean }`
- **Success response:** same shape as 7.12.
- **Errors:** `401`; `422` validation.
- **Source:** `src/components/web/patient/WebPatientSettings.tsx`, `src/components/mobile/patient/MobilePatientSettings.tsx`

### 7.14 `POST /api/auth/change-password` (patient variant)

Change the current user's password. Placed under `/api/auth/` rather than `/api/v1/` since it's an auth-boundary action, consistent with login/register/logout/me. Same contract as §6.26.

- **Auth:** `PATIENT`, `NURSE`, `ADMIN`, `SUPER_ADMIN`
- **Request body:** `{ "currentPassword": "...", "newPassword": "..." }`
- **Success response:** `{ "success": true }`
- **Errors:** `401` current password incorrect; `422` new password fails policy.
- **Source:** `src/components/web/patient/WebPatientSettings.tsx`, `src/components/mobile/patient/MobilePatientSettings.tsx`, `src/hooks/use-auth.ts`

---

## 8. Known Gaps / Assumptions

These are open questions the FastAPI implementer should resolve with the frontend/product team before finalizing the contract:

1. **Login vs `/me` response shape mismatch.** `POST /api/auth/login` returns `{ user: UserPublic }`, while `GET /api/auth/me` returns a bare `UserPublic`. Either intentional or an accident — pick one and reconcile the frontend.
2. **Patient registration `dob` field.** The frontend sends `dob` in the patient registration payload, but `RegisterPatientRequest` doesn't declare it. Confirm whether date of birth is actually collected for patients and add it to the type, or drop it from the form.
3. **Nurse registration documents are never uploaded.** The nurse registration UI collects 3 files but never sends them — no multipart upload happens during registration today. Either add a combined multipart registration endpoint, or a separate post-registration document upload step (the latter matches `POST /api/v1/nurse/documents`, §6.16).
4. **No live services fetch anywhere.** Both public and patient-facing services pages read a hardcoded `HEALTHCARE_SERVICES` constant. `GET /api/v1/services` and `GET /api/v1/services/{slug}` are fully inferred and unconfirmed by any real network call.
5. **No password-reset/forgot-password/OTP flow wired**, despite validators (`forgotPasswordSchema`, `verifyOtpSchema`, `resetPasswordSchema`) and a login-page link existing for it. Not included in this spec — needs its own design pass if required for launch.
6. **No token-refresh call in the frontend.** Given 15-minute access tokens and 30-day refresh tokens, some refresh mechanism is needed, but nothing in `api-client.ts` currently performs one explicitly. Recommend the backend define the exact mechanism (silent refresh on `/me`, 401-retry-once, etc.) and have the frontend implement it.
7. **Admin Services CRUD, Contacts status-update, and most Nurse/Patient portal endpoints are UI stubs with no wired `onClick`/fetch calls.** These are all flagged inline as *inferred* — they're reasonable, type-shape-driven guesses, not confirmed contracts. Treat them as a starting proposal for backend-frontend alignment, not gospel.
8. **Roles & Permissions may not need to be a live CRUD resource at all.** `src/lib/constants.ts` defines a fixed, code-level `PERMISSIONS`/`DEFAULT_ROLE_PERMISSIONS` matrix for exactly 4 system roles. The Super Admin Roles/Permissions screens are currently 100% static mock data with zero fetch calls and no `useRoles` hook. Confirm with product whether `GET /api/v1/admin/roles` and `GET /api/v1/admin/permissions` (§5.6, §5.7) should exist as real endpoints, or whether the backend should simply mirror the same static constants server-side.
9. **`GET /api/v1/admin/permissions` is a dead link today** — the dashboard links to `/super-admin/permissions` but no such page exists in the frontend routes. Lowest-confidence entry in this document.
10. **`DashboardStats` type is under-specified.** The shared type (`src/types/index.ts`) declares only `totalPatients`, `totalNurses`, `pendingVerifications`, `waitlistCount`, `newContacts`, `recentActivity` — but the Super Admin dashboard components also destructure `totalAdmins` and `totalAuditLogs`. The backend response must be a superset of the declared type.
11. **`GET /api/v1/admin/settings` does not exist in the frontend** — only `PUT`. The settings form has no way to load persisted values on mount today; recommend adding `GET` for correctness regardless.
12. **Nurse availability has two incompatible data models in the frontend** — a day-of-week + shift-preference model (`nurseSlice.availability`) and a separate 7×4 slot-grid model (`useAvailability.ts`/`WebNurseAvailability.tsx`). This spec models `GET`/`PUT /api/v1/nurse/availability` on the richer slice-based shape and flags the slot-grid as an alternate representation needing reconciliation.
13. **`AppointmentStatus` enum vs actual UI/reducer usage mismatch** (nurse portal) — 8 documented statuses exist but the Redux reducers and UI buttons only ever produce/branch on a subset, and never consistently. Recommend standardizing the full state machine before backend implementation: `REQUESTED → ACCEPTED/REJECTED → CONFIRMED → IN_PROGRESS → COMPLETED`, with `CANCELLED` as a terminal decline state.
14. **Patient "Care Plan," "Health Summary," and "Emergency Contact" features have no backing types at all** in `src/types/index.ts` — they exist only as hardcoded mock data (`src/features/patient/dashboardData.ts`) with an explicit code comment marking them temporary. Confirm these are real, scoped product features before building `GET/PUT` endpoints for them (§7.9–7.11); `PatientProfilePublic` would need new fields for emergency contact specifically.
15. **"Nearby Providers" mixes Nurse/Doctor/Pharmacist roles in the UI mock**, but only `NurseProfilePublic` exists as a backing type — no Doctor/Pharmacist actor type exists anywhere in the codebase. This spec scopes `GET /api/v1/nurses/nearby` to nurses only; do not build separate doctor/pharmacist resources unless product confirms the need.
16. **Waitlist CSV export is entirely client-side** (from already-fetched list data) — no dedicated server export endpoint exists or is needed unless an authoritative full-dataset export is explicitly requested.
17. **No `suspend`→`reactivate` distinction for admin accounts** — a single `POST /api/v1/admin/admins/{publicId}/suspend` is expected to toggle state bidirectionally based on the account's current status, since that's all the frontend calls.
