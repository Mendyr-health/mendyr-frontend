# 📋 Development Changelog & Architectural Summary (Last 48 Hours)

**Date Range:** July 25, 2026 – July 27, 2026  
**Repository:** `Mendyr-health/mendyr-frontend`  
**Active Branch:** `keshav`

---

## 🌟 Executive Summary

Over the past two days, the project underwent significant architectural restructuring, state management modernization, and feature expansions across both mobile and desktop domains. The overarching theme of these changes revolves around **decoupling backend services from the frontend codebase**, **native mobile application integration via Capacitor**, and **implementing a robust Nurse Clinical Portal with centralized Redux state management**.

---

## 🚀 Key Architectural & Feature Milestones

### 1. 📱 Native Mobile Integration & Codebase Separation (July 25, 2026)
*Lead Contributor: Nikhil Rawat*

#### **Capacitor Mobile Framework Integration**
* Introduced **Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`)** to transform the Next.js web application into cross-platform native iOS and Android applications.
* Created comprehensive native project directories and build configurations:
  * **Android (`/android`)**: Complete Gradle build pipeline, AndroidManifest configuration, custom launcher icons, and responsive multi-density splash screen assets (`drawable-port-xxxhdpi`, `mipmap-xxxhdpi`, etc.).
  * **iOS (`/ios`)**: Xcode project setup (`App.xcodeproj`), CocoaPods dependency management (`Podfile`), native launch screens (`LaunchScreen.storyboard`), and multi-resolution AppIcon/Splash asset catalogs.

#### **Frontend & Backend Decoupling (Source Code Separation)**
* Executed a major architectural cleanup by **separating mobile and desktop source code** and removing monolithic server-side APIs from this repository to focus purely on frontend and client-side mobile rendering:
  * **Removed Server APIs (`/src/app/api/*`)**: Cleaned up internal Next.js API route handlers for authentication (`login`, `register`, `google`, `otp`, `refresh`), admin management, waitlist, services, contacts, nurses, and patients.
  * **Removed Backend Libraries & Infrastructure**: Purged database ORM schemas and caching utilities (`prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/opensearch.ts`, `src/lib/redis.ts`, `src/lib/jwt.ts`, `src/lib/email.ts`, `docker-compose.yml`), delegating these responsibilities to dedicated backend microservices.
  * **Mobile View Pages & Templates**: Added dedicated mobile-responsive view configurations and standardized Pull Request templates for team collaboration.

#### **CI/CD Pipeline Optimization**
* Designed automated GitHub Actions workflows specifically tailored for cross-platform builds:
  * **Platform-Specific Workflows**: Separated Continuous Integration pipelines into isolated **iOS CI** and **Android CI** workflows.
  * **Capacitor CI Build Fixes**: Resolved Gradle and CocoaPods build failures in CI pipelines, ensuring automated verification of native mobile bundles on every pull request.

---

### 2. 🩺 Comprehensive Nurse Portal & State Management (July 26, 2026)
*Lead Contributor: Keshavendra Tripathi*

#### **Nurse Clinical Portal (`feat(nurse)`)**
* Built an extensive, responsive clinical portal tailored for nursing staff and healthcare providers:
  * **Clinical Visits Management**: Real-time tracking and workflow UI for patient clinical visits, appointments, and treatment schedules.
  * **Real-Time Messaging**: Interactive messaging interface enabling seamless communication between nurses, patients, and healthcare administrators.
  * **Earnings & Financial Dashboard**: Analytical dashboard displaying nurse earnings, visit histories, and performance metrics.
  * **Mobile Responsive Views**: Fully optimized layout designs ensuring smooth usability across mobile viewports and native Capacitor apps.

#### **Redux Global State Modernization (`feat(redux)`)**
* Upgraded application-wide state management to support complex clinical workflows:
  * **`nurseSlice` Implementation**: Created a comprehensive Redux slice (`src/store/slices/appSlice.ts`) complete with clinical datasets and state reducers.
  * **Appointments Hook Integration**: Connected appointment scheduling and data-fetching hooks directly into the centralized Redux store (`src/store/index.ts`, `src/store/hooks.ts`), replacing fragmented local states.
  * **App Slice Enhancements**: Expanded app state slices to manage global interface states and responsive UI toggles.

#### **Authentication & UI UX Enhancements (`fix(auth)`)**
* Improved user onboarding and form reliability:
  * **DOB Calendar Enhancements**: Integrated intuitive Year and Month dropdown selectors into the Date of Birth calendar picker within authentication forms, dramatically enhancing user experience during registration.
  * **React Hook Form (RHF) Event Handling**: Resolved critical `onChange` event propagation bugs in form inputs, ensuring seamless field validation and state updates.

---

### 3. 🌐 Internationalization (i18n) & Configuration Updates
* **Multi-Language Support**: Added internationalization provider configuration (`src/components/I18nProvider.tsx`, `src/i18n/config.ts`) along with English (`src/i18n/locales/en.json`) and Hindi (`src/i18n/locales/hn.json`) translation schemas.
* **Package & Dependency Modernization**: Updated `package.json` and `package-lock.json` with native Capacitor dependencies, Redux toolkits, and modern UI utilities.
* **SEO & Crawling**: Configured automated routing utilities for `src/app/robots.ts` and `src/app/sitemap.ts`.

---

## 📊 Summary Table of Changes by Category

| Category | Primary Changes | Affected Codebase Areas |
| :--- | :--- | :--- |
| **📱 Native Mobile (Capacitor)** | Integrated iOS & Android native wrappers, splash screens, launcher icons, and native project pipelines. | `capacitor.config.ts`, `android/*`, `ios/*` |
| **🏗️ Architecture & Decoupling** | Removed monolithic server APIs, Prisma ORM, Redis, OpenSearch, and email services to decouple frontend from backend. | `src/app/api/*`, `src/lib/*`, `prisma/*`, `docker-compose.yml` |
| **🩺 Nurse Clinical Portal** | Added clinical visit tracking, real-time messaging, earnings dashboard, and mobile UI layouts. | Nurse portal views, components, layouts |
| **🧠 State Management** | Implemented comprehensive nurse state in Redux, connected global appointments hook, and updated store configurations. | `src/store/slices/*`, `src/store/index.ts`, `src/store/hooks.ts` |
| **🔐 Form UX & Auth** | Fixed React Hook Form `onChange` event handling and added Year/Month dropdowns to DOB picker. | Auth pages, DOB calendar components |
| **⚙️ DevOps & CI/CD** | Separated iOS/Android CI workflows, optimized build speeds, and fixed Gradle build errors in GitHub Actions. | CI workflows, build scripts |

---

> [!TIP]
> **Next Steps for Development:**
> - Test native iOS and Android builds using `@capacitor/cli` (`npx cap sync`, `npx cap run android`).
> - Verify API communication with the externalized backend services after API decoupling.
> - Expand internationalization translation keys across all newly added Nurse Portal screens.
