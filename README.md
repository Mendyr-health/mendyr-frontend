# Mendyr - Frontend & Mobile Client

This is the official frontend and mobile application repository for Mendyr, an at-home healthcare and nursing platform.

This project is configured as a purely static **Frontend Only** Next.js application designed to seamlessly interface with a separate **FastAPI Backend**. By utilizing Capacitor, this single codebase compiles natively to iOS and Android applications in addition to the web.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Static Export)
- **Mobile Runtime**: [Capacitor 8](https://capacitorjs.com/) (iOS & Android)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK Query for API fetching)
- **Internationalization**: [react-i18next](https://react.i18next.com/) (English & Hindi Support)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- iOS: Xcode and CocoaPods (Mac only)
- Android: Android Studio

### 1. Environment Setup

Ensure your backend API URL is configured correctly. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` must be the backend's absolute origin (no trailing path). All API calls resolve against it explicitly — the Capacitor iOS/Android builds load the app from a local scheme with no same-origin proxy, so relative `fetch("/api/...")` calls cannot work on-device. See [`src/lib/api-client.ts`](src/lib/api-client.ts).

### 2. Web Development

To run the Next.js development server for the browser:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application. The page will auto-reload as you make edits to the codebase.

---

## 📱 Mobile Development (iOS & Android)

Capacitor bridges the Next.js static HTML export with native mobile wrappers. 

Whenever you are ready to test your changes natively on an emulator or physical device, you must build the Next.js app and sync it with Capacitor:

```bash
# 1. Export the Next.js app as a static HTML bundle into the `out/` directory
npm run build

# 2. Sync the bundled web assets and plugins to the native iOS/Android projects
npx cap sync
```

### Running on Android
Open the native Android project in Android Studio:
```bash
npx cap open android
```
From Android Studio, you can build the APK, manage SDKs, and launch the Android Emulator.

### Running on iOS
Open the native iOS project in Xcode:
```bash
npx cap open ios
```
From Xcode, you can manage provisioning profiles and launch the iOS Simulator. Requires CocoaPods (`brew install cocoapods`) before the first `cap sync`.

---

## 📦 Two Apps, One Codebase

Mendyr ships as two separate installable apps built from this repo: a **patient app** and a **provider app** (nurses/pharmacists/doctors/admin staff). Which one you get is controlled by `NEXT_PUBLIC_APP_TARGET` — it picks the minimal native home screen branding and which registration path is offered (see [`src/lib/app-target.ts`](src/lib/app-target.ts)).

There's still only one `android/` and `ios/` native project checked in — building a given target re-identifies it (applicationId/bundle id + display name) rather than maintaining two full duplicate native trees. Before shipping both apps to the stores in parallel, split into two real native project directories; until then:

```bash
# Patient app
npm run sync:patient    # builds with NEXT_PUBLIC_APP_TARGET=patient, re-identifies the native project, then cap sync

# Provider app
npm run sync:provider
```

Then `npx cap open android` / `npx cap open ios` as usual. See [`scripts/apply-app-target.js`](scripts/apply-app-target.js) for exactly what gets patched.

---

## 🧪 Trying the App Without a Backend

There's no backend running yet, so the login form falls back to a dummy session if the API is unreachable (a network error, not a rejected password — once a real backend responds, this stops triggering). The role is picked from a keyword in the email:

| Email contains | Role routed to |
|---|---|
| `super` | Super Admin |
| `admin` | Admin |
| `nurse`, `pharmacist`, or `doctor` | Nurse |
| anything else | Patient |

e.g. sign in with `nurse@test.com` / any password to land on the nurse dashboard with dummy data. First login for a role goes through a one-time "Tell us about yourself" step ([`/onboarding`](src/app/(auth)/onboarding/page.tsx)) before reaching the dashboard. See [`src/lib/mock-users.ts`](src/lib/mock-users.ts), [`src/lib/mock-session.ts`](src/lib/mock-session.ts), and [`src/lib/onboarding.ts`](src/lib/onboarding.ts).

---

## 🌐 Internationalization (i18n)

This project supports multi-language configurations powered by `i18next`.
- Configuration is located at `src/i18n/config.ts`.
- Translation dictionaries are stored as JSON files under `src/i18n/locales/`:
  - `en.json` (English)
  - `hn.json` (Hindi)

To add new translations, update the respective JSON files and use the `useTranslation` hook inside your components:

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

---

## 🏗️ Folder Structure

This project follows SOLID design principles, strictly separating concerns:

```text
mendyr/
├── android/               # Native Android project (Managed by Capacitor)
├── ios/                   # Native iOS project (Managed by Capacitor)
├── public/                # Static assets (images, fonts, robots.txt)
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts)
│   ├── components/        # Reusable React components (UI library, shared elements)
│   ├── hooks/             # Custom React Hooks
│   ├── i18n/              # Localization config and translation JSON files
│   ├── lib/               # Utility functions, constants, formatting
│   ├── store/             # Redux Store (Slices, RTK Query API, Provider)
│   └── types/             # TypeScript global interfaces & definitions
├── capacitor.config.ts    # Capacitor core configuration
├── next.config.ts         # Next.js configuration (Set to output: 'export')
└── tailwind.config.ts     # Tailwind CSS theme and design tokens
```

---

## 🌳 Git Workflow & Branch Naming Conventions

To keep our repository organized and our CI/CD pipelines running smoothly, please follow these branch naming conventions when creating new branches:

- **`feature/*`**: For new features, major additions, or user-facing changes.
  *Example:* `feature/patient-dashboard`, `feature/push-notifications`
- **`bugfix/*`** or **`fix/*`**: For bug fixes and resolving issues in existing code.
  *Example:* `bugfix/login-crash`, `fix/calendar-timezone`
- **`architecture/*`**: For core structural changes, major refactors, or infrastructure updates.
  *Example:* `architecture/monorepo-migration`, `architecture/api-client`
- **`tech-debt/*`** or **`chore/*`**: For maintenance, dependency updates, removing deprecated code, or general cleanups.
  *Example:* `tech-debt/remove-old-ui`, `chore/update-react`
- **`docs/*`**: For changes exclusively related to documentation.
  *Example:* `docs/api-readme`

When opening a Pull Request, please ensure you use the provided Pull Request template and link any relevant issue numbers.
