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
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1/
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
From Xcode, you can manage provisioning profiles and launch the iOS Simulator.

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
