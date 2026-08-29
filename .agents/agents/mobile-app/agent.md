# Mendyr – Capacitor-Ready Next.js App: Agent Rules

This project is a **Next.js (App Router, static export)** web application that is
packaged as a **native Android & iOS app using Capacitor**. Every change you make
must work flawlessly in **both** the browser *and* the native shell.
Treat these rules as non-negotiable constraints.

---

## 1. Architecture & Build Pipeline

### Static Export (Critical)
- `next.config.ts` uses `output: "export"` and `images: { unoptimized: true }`.
  **Never remove or change these settings.** Capacitor serves the built `out/`
  directory as a local web app inside a native WebView.
- **No server-side features**: Do NOT use `getServerSideProps`, Server Actions,
  API routes (`app/api/`), middleware, ISR, or any feature that requires a
  Node.js server. Everything must be purely client-side.
- All data fetching must happen client-side (e.g., `fetch` in `useEffect`,
  React Query, Redux Toolkit Query, SWR).

### Capacitor Config
- `capacitor.config.ts` sets `webDir: 'out'`. After building, run
  `npx cap sync` to copy assets into native projects.
- App ID: `com.mendyr.app`. Do not change this without coordinating with the
  team.

### Environment Variables
- Only `NEXT_PUBLIC_*` variables are available at build time in a static export.
- For native builds, these are baked in at build time—plan accordingly (e.g.,
  use different `.env.production` files per target).

---

## 2. Navigation & Back Button Handling (Critical for Mobile UX)

### Hardware / System Back Button
The Android hardware back button and iOS swipe-back gesture **must not** close
the app unexpectedly. Implement the following pattern:

```typescript
// Use @capacitor/app plugin for back-button control
import { App as CapApp } from '@capacitor/app';

// In your root layout or a global provider:
CapApp.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    // On the root/home screen: show a "press again to exit" toast,
    // or call CapApp.minimizeApp() instead of CapApp.exitApp().
    CapApp.minimizeApp();
  }
});
```

**Rules:**
- **Never** call `CapApp.exitApp()` directly on back press—always minimize or
  confirm exit.
- Every navigation action (`router.push`, `<Link>`) must push a real history
  entry so `window.history.back()` works correctly.
- Modals, drawers, bottom sheets, and dropdown menus **must** push a history
  state on open and pop it on close, so the back button dismisses them instead
  of navigating away.
- Tab switches should **replace** history (not push) so back doesn't cycle
  through tabs.

### Deep Linking & URL Scheme
- Configure deep links in `capacitor.config.ts` when needed.
- All routes must be defined as static pages (no dynamic server routes).

---

## 3. Session & Auth Persistence

### Token Storage
- Store JWT / auth tokens in **secure storage** on native (`@capacitor/preferences`
  or `@capacitor/secure-storage`) and `localStorage` on web.
- Create a platform-aware storage utility:

```typescript
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const storage = {
  async get(key: string) {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value;
    }
    return localStorage.getItem(key);
  },
  async set(key: string, value: string) {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },
  async remove(key: string) {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  },
};
```

### Session Continuity
- The app must **restore the user session** on cold start by reading persisted
  tokens and rehydrating the Redux auth slice.
- Implement **silent token refresh**: if the access token is expired but the
  refresh token is valid, refresh transparently before forcing re-login.
- On `CapApp.addListener('appStateChange', ...)`, revalidate the session when
  the app resumes from background.
- **Never** redirect to login on every app launch—check stored tokens first.

---

## 4. Mobile-First UI/UX Best Practices

### Layout & Spacing
- Design **mobile-first** (min-width breakpoints, not max-width).
- Respect **safe areas** (notch, status bar, home indicator). Apply padding:
  ```css
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  ```
- Minimum touch target size: **44×44px** (Apple HIG) / **48×48dp** (Material).
- Avoid hover-only interactions—they don't exist on touch devices. Always
  provide tap/press alternatives.

### Scrolling & Overflow
- Use native scrolling (`overflow-y: auto`) instead of custom JS scrollbars.
- Add `-webkit-overflow-scrolling: touch` for momentum scrolling on iOS.
- Prevent body scroll when a modal/drawer is open (use `overflow: hidden` on
  `<body>` or a scroll-lock hook).
- Avoid `100vh` for full-height layouts—use `100dvh` (dynamic viewport height)
  or a CSS custom property that accounts for the mobile browser chrome.

### Typography & Readability
- Base font size ≥ 16px to prevent iOS auto-zoom on input focus.
- Use the project's configured fonts (loaded via `next/font`).
- Ensure sufficient color contrast (WCAG AA minimum: 4.5:1 for text).

### Inputs & Forms
- Always set `inputMode`, `type`, and `autoComplete` on inputs for proper
  native keyboards (e.g., `inputMode="email"`, `type="tel"`).
- Use `font-size: 16px` or larger on inputs to prevent iOS Safari zoom.
- Dismiss the keyboard on form submit or when tapping outside.

### Images & Assets
- Use `<img>` tags with explicit `width` and `height` (or CSS aspect-ratio)
  to prevent layout shift. Do NOT use `next/image` (it requires a server).
- Compress images. Prefer WebP. Use `loading="lazy"` for below-the-fold images.

### Animations
- Use `framer-motion` (already installed) for animations.
- Respect `prefers-reduced-motion`—disable or simplify animations when set.
- Keep animations under 300ms for UI transitions. Avoid blocking interactions.
- Use `transform` and `opacity` for animations—they are GPU-accelerated and
  won't cause repaints.

---

## 5. Performance Optimization

### Bundle Size
- Audit bundle size regularly. Avoid importing entire libraries when you only
  need a single function (e.g., import specific `date-fns` functions, not the
  whole package).
- Use dynamic imports (`next/dynamic` with `{ ssr: false }`) for heavy
  components (charts, rich editors) to keep the initial bundle small.
- Tree-shake aggressively—ensure all imports are specific.

### Rendering
- Avoid unnecessary re-renders: memoize with `React.memo`, `useMemo`,
  `useCallback` where measurable benefit exists.
- Virtualize long lists (use `react-window` or `@tanstack/react-virtual`)
  instead of rendering thousands of DOM nodes.
- Debounce search inputs and other high-frequency events.

### Network
- Cache API responses appropriately (Redux Toolkit Query cache, SWR config).
- Show loading skeletons instead of blank screens while fetching data.
- Implement optimistic updates for mutations (likes, toggles, status changes).
- Handle offline state gracefully—show a banner and queue actions when possible.

---

## 6. Native Platform Integration

### Status Bar & Navigation Bar
- Use `@capacitor/status-bar` to style the status bar (color, style) to match
  the app theme. Dark backgrounds → light status bar text, and vice versa.
- On Android, style the navigation bar color to match.

### Splash Screen
- Configure splash screen via `@capacitor/splash-screen`. Hide it only after
  the app has hydrated and the initial data is loaded.

### Haptic Feedback
- Use `@capacitor/haptics` for tactile feedback on important actions (e.g.,
  successful form submit, destructive action confirmation).

### Network Status
- Use `@capacitor/network` to detect connectivity changes.
- Show an offline indicator when the device loses connection.
- Queue failed requests and retry when back online.

### Push Notifications (when implemented)
- Use `@capacitor/push-notifications` for native push.
- Request permission at a contextually appropriate moment (not on first launch).

### Camera & File Picker (when implemented)
- Use Capacitor plugins (`@capacitor/camera`, `@capacitor/filesystem`) instead
  of browser APIs for native-quality file access.

---

## 7. State Management (Redux Toolkit)

- Use **Redux Toolkit** (`@reduxjs/toolkit`) as the primary state manager.
- Use **RTK Query** for all API calls with caching, polling, and invalidation.
- Keep the Redux store serializable—no class instances, functions, or Promises.
- Persist auth state and critical user preferences using the storage utility
  from Section 3. Use `redux-persist` or a manual rehydration pattern.
- Colocate feature state in `src/features/<feature>/` slices.

---

## 8. Styling (Tailwind CSS)

- This project uses **Tailwind CSS v4** with `@tailwindcss/postcss`.
- Follow the existing design token system in `tailwind.config.ts` and
  `globals.css`.
- Use `shadcn/ui` component patterns (configured in `components.json`).
- Dark mode must work everywhere—use `dark:` variants consistently.
- Never use hardcoded colors—always use theme tokens (`bg-primary`,
  `text-foreground`, etc.).

---

## 9. Internationalization (i18n)

- This project uses `react-i18next` for translations.
- **Never hardcode user-facing strings.** Always use the `t()` function.
- Translation files live in `src/i18n/`.
- Use ICU message format for pluralization and interpolation.
- Right-to-left (RTL) support: use logical CSS properties (`margin-inline-start`
  instead of `margin-left`).

---

## 10. Error Handling & Resilience

- Wrap route segments with React Error Boundaries (see `global-error.tsx`).
- Show user-friendly error messages—never expose raw API errors or stack traces.
- Implement retry logic for transient network failures.
- Log errors to a monitoring service (when configured).
- Handle edge cases: empty states, loading states, error states for every
  data-driven component.

---

## 11. Accessibility (a11y)

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`, etc.).
- All interactive elements must be keyboard-navigable (even though it's mobile,
  accessibility tools require it).
- Add `aria-label` to icon-only buttons.
- Ensure focus management: trap focus in modals, return focus on close.
- Screen reader announcements for route changes and async operations.

---

## 12. Testing Considerations

- All interactive elements should have unique `data-testid` attributes for
  E2E testing.
- Components should be testable in isolation—keep business logic in hooks/utils,
  not deeply nested in JSX.

---

## 13. File & Folder Conventions

```
src/
├── app/              # Next.js App Router pages (route groups)
│   ├── (auth)/       # Auth-related pages (login, register, etc.)
│   ├── (dashboard)/  # Authenticated app pages
│   └── (public)/     # Public marketing pages
├── components/       # Shared UI components (shadcn/ui + custom)
├── features/         # Feature modules (each with its own slice, hooks, UI)
├── hooks/            # Shared custom hooks
├── i18n/             # Translation files and i18n config
├── lib/              # Utilities, API client, storage helpers
├── store/            # Redux store setup, root reducer
└── types/            # Shared TypeScript types/interfaces
```

- Keep components small and focused. One component per file.
- Colocate feature-specific components within `features/<name>/components/`.
- Export shared components from `components/` barrel files.

---

## 14. Pre-Commit Checklist (for the Agent)

Before considering any task complete, verify:

- [ ] Works in browser (`npm run dev`)
- [ ] Builds successfully (`npm run build` → static export to `out/`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] No server-side features used (no `getServerSideProps`, API routes, etc.)
- [ ] Back button behavior tested (modals close, app doesn't exit)
- [ ] Auth session persists across app restarts
- [ ] Safe area insets respected in new layouts
- [ ] Touch targets are ≥ 44px
- [ ] All user-facing strings use `t()` for i18n
- [ ] Dark mode works for new/modified components
- [ ] Loading, empty, and error states handled
- [ ] No hardcoded colors—theme tokens used
- [ ] Images use `<img>` with dimensions, not `next/image`
- [ ] No memory leaks (listeners cleaned up, subscriptions unsubscribed)
- [ ] Keyboard dismissed properly on navigation / form submit
- [ ] Pull-to-refresh works on scrollable pages (if applicable)
- [ ] Page transitions are smooth, no white flash between routes
- [ ] API requests include proper error handling and retry logic
- [ ] Sensitive data is never logged or exposed in production builds

---

## 15. WebView-Specific Optimizations (Critical for Capacitor)

### Rendering Performance
- Avoid heavy DOM manipulation during scroll events—use `IntersectionObserver`
  instead of scroll listeners for lazy loading and infinite scroll.
- Minimize CSS `box-shadow`, `filter: blur()`, and `backdrop-filter` usage on
  low-end Android devices—these cause significant frame drops in WebViews.
- Use `will-change: transform` sparingly and only on elements that will animate.
  Remove it after the animation completes.
- Prefer CSS animations over JS-driven animations where possible—they run on
  the compositor thread and don't block the main thread.

### WebView Quirks
- Android WebView may not support all modern CSS features. Test on real devices
  and use feature queries (`@supports`) for progressive enhancement.
- iOS WKWebView has a 300ms tap delay in some versions—ensure
  `touch-action: manipulation` is set on interactive elements.
- Disable pull-to-refresh on the native WebView level (via Capacitor config)
  if you implement your own pull-to-refresh UI to avoid double-triggering.

### Content Security
- Capacitor apps load from `capacitor://localhost` (iOS) and
  `http://localhost` (Android). Ensure CORS policies on your API allow these
  origins.
- Never load external scripts from CDNs at runtime in production—bundle
  everything. CDN failures = broken app with no way to update until next release.

---

## 16. Memory Leak Prevention

### Listener Cleanup
- **Every** `addEventListener`, `setInterval`, `setTimeout`,
  `CapApp.addListener`, and subscription **must** be cleaned up in the
  component's cleanup function (`useEffect` return) or on unmount.
- Use the pattern:

```typescript
useEffect(() => {
  const handler = CapApp.addListener('backButton', callback);
  return () => {
    handler.then(h => h.remove());
  };
}, []);
```

### Common Leak Sources
- Unremoved event listeners on `window`, `document`, or DOM nodes.
- Orphaned Redux subscriptions or RTK Query polling that continues after
  component unmount.
- Closures capturing large objects (e.g., entire API responses) in `useCallback`
  or `useMemo` without proper dependency arrays.
- WebSocket or SSE connections not closed on unmount.
- Storing references to detached DOM nodes.

### Detection
- Test with Chrome DevTools "Performance Monitor" → watch JS heap size over
  time. It should stabilize, not grow continuously.
- Use "Memory" tab → heap snapshots to compare before/after navigating between
  routes.

---

## 17. App Lifecycle Management

### Cold Start Optimization
The app must feel **instant**. Target < 2 seconds from tap to interactive content.

1. Show the Capacitor splash screen immediately (native-layer).
2. Render a lightweight app shell (header + skeleton) **before** any data fetch.
3. Rehydrate auth from storage in parallel with rendering the shell.
4. Fetch critical data (user profile, config) only after auth is confirmed.
5. Hide splash screen only after the first meaningful paint.

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// In your root layout's useEffect:
useEffect(() => {
  async function init() {
    await rehydrateAuth();     // Read tokens from storage
    await fetchUserProfile();  // Get critical data
    SplashScreen.hide();       // NOW hide the splash
  }
  init();
}, []);
```

### Background / Foreground Transitions
- When the app goes to background: pause timers, stop polling, cancel
  non-critical network requests.
- When the app returns to foreground: revalidate session, refresh stale data,
  check for missed push notifications.

```typescript
CapApp.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    // Resumed — revalidate
    store.dispatch(authApi.endpoints.refreshSession.initiate());
    store.dispatch(dataApi.util.invalidateTags(['UserData']));
  } else {
    // Backgrounded — pause polling
    // (RTK Query polling is automatically paused when tab is hidden)
  }
});
```

### Low-Memory Warnings
- Listen for low-memory events if available, and proactively clear caches
  (image caches, large in-memory data).

---

## 18. Security Hardening

### Token Security
- **Never** store tokens in cookies (WebView doesn't handle them reliably).
- Use `@capacitor/preferences` (or `@capacitor/secure-storage` for sensitive
  data) on native, `localStorage` on web.
- Clear all auth data on logout—tokens, cached user data, and sensitive state.
- Implement token rotation: refresh tokens should be single-use. After refresh,
  the old refresh token is invalidated.

### Input Sanitization
- Sanitize all user inputs before rendering (prevent XSS in WebView context).
- Never use `dangerouslySetInnerHTML` unless the content has been sanitized
  with a library like DOMPurify.
- Validate all form data client-side (with Zod/Yup) AND trust that the server
  validates again.

### Sensitive Data
- Never log tokens, passwords, or PII to the console in production.
- Use environment variable `NODE_ENV` to gate debug logging:
  ```typescript
  const log = process.env.NODE_ENV === 'development' ? console.log : () => {};
  ```
- Strip `console.log` statements in production builds (configure via Next.js
  compiler options or a Babel plugin).

### Certificate Pinning (Advanced)
- For high-security apps, implement certificate pinning via a Capacitor plugin
  to prevent MITM attacks.

---

## 19. Gesture & Interaction Handling

### Swipe Gestures
- Implement swipe-to-go-back on iOS (native behavior) without conflicting with
  in-app horizontal swipe gestures (carousels, drawers).
- For swipeable elements (e.g., swipe-to-delete in lists), use a gesture
  library compatible with `framer-motion` and ensure they don't conflict with
  the native back gesture.

### Pull-to-Refresh
- Implement pull-to-refresh on scrollable content pages using a custom
  component (not the browser default).
- Disable the native WebView pull-to-refresh to avoid double-trigger:
  ```typescript
  // In capacitor.config.ts:
  server: {
    androidScheme: 'https',
    // Disable native pull-to-refresh
    overScrollMode: 'never'
  }
  ```
- Show a smooth animation during refresh. Use haptic feedback on trigger.

### Long Press
- Implement long-press actions (e.g., context menus) with a visual indicator
  (ripple effect or scale animation) so users know something is happening.
- Use a 500ms threshold for long press.
- Prevent the default browser context menu on long press:
  ```css
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  ```

### Scroll Behaviors
- Implement **infinite scroll** with `IntersectionObserver`, not scroll-position
  calculations.
- Always show a "loading more" indicator at the bottom when fetching the next
  page.
- Preserve scroll position when navigating back to a list page. Use a scroll
  restoration hook or store scroll positions in a ref/state.

---

## 20. Keyboard Handling (Critical for Mobile Forms)

### Keyboard-Aware Layouts
- When the software keyboard opens, it pushes content up. Ensure:
  - The focused input is **always visible** above the keyboard.
  - Fixed bottom bars (tab bars, CTAs) are either hidden or repositioned when
    the keyboard is open.
  - Use `visualViewport` API to detect keyboard height:

```typescript
useEffect(() => {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const onResize = () => {
    const keyboardHeight = window.innerHeight - viewport.height;
    document.documentElement.style.setProperty(
      '--keyboard-height', `${keyboardHeight}px`
    );
  };

  viewport.addEventListener('resize', onResize);
  return () => viewport.removeEventListener('resize', onResize);
}, []);
```

### Keyboard Dismissal
- Dismiss the keyboard when:
  - The user taps outside an input field.
  - A form is submitted.
  - The user navigates to a different page.
  - A modal or bottom sheet closes.
- Use `document.activeElement?.blur()` or `Keyboard.hide()` from
  `@capacitor/keyboard` plugin.

### Input Focus Management
- When opening a form modal, auto-focus the first input after the open
  animation completes (not during—it causes jank).
- When pressing "Next" on the keyboard, move focus to the next input field
  using `tabIndex` or explicit `ref.focus()` calls.
- Set `enterKeyHint` on inputs (`"next"`, `"done"`, `"search"`, `"send"`) for
  the correct keyboard return key label.

---

## 21. Smooth Page Transitions

### Route Transition Animations
- Use `framer-motion`'s `AnimatePresence` to animate route transitions:
  - Forward navigation: slide in from right.
  - Back navigation: slide in from left.
  - Modal routes: slide up from bottom.
- Keep transition duration ≤ 250ms for snappy feel.

```typescript
// Wrap page content:
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Preventing White Flashes
- Preload critical CSS and fonts to avoid FOUC (Flash of Unstyled Content).
- Set the `<body>` and `<html>` background color to match the app's primary
  background in `globals.css`—this prevents white flashes between routes.
- Use `loading` states with skeleton screens that match the final layout shape
  to avoid layout shifts.

### Navigation Prefetching
- Next.js automatically prefetches `<Link>` targets. Ensure all navigation
  uses `<Link>` components (not `<a>` tags) to benefit from this.
- For programmatic navigation, use `router.prefetch(path)` for known
  next-steps (e.g., prefetch the dashboard while login is processing).

---

## 22. Caching & Offline Strategy

### API Response Caching
- Configure RTK Query cache lifetimes per endpoint:
  - Frequently changing data (notifications): `keepUnusedDataFor: 30` (seconds).
  - Rarely changing data (user profile): `keepUnusedDataFor: 300`.
  - Static config data (feature flags): `keepUnusedDataFor: 3600`.
- Use `refetchOnMountOrArgChange` for data that must be fresh on every view.
- Use `refetchOnReconnect: true` to automatically refresh stale data when the
  device comes back online.

### Offline Support
- Detect offline state with `@capacitor/network`:

```typescript
import { Network } from '@capacitor/network';

Network.addListener('networkStatusChange', (status) => {
  store.dispatch(setOnlineStatus(status.connected));
});
```

- When offline:
  - Show a persistent, non-intrusive offline banner (not a blocking modal).
  - Allow browsing cached/previously-loaded data.
  - Queue write operations (form submissions, likes, etc.) and replay them
    when back online.
  - Disable buttons/actions that absolutely require network (e.g., payment).

### Asset Caching
- Use the Service Worker (if configured) to cache static assets for offline
  access.
- For images, implement a progressive loading strategy: thumbnail → full-size.

---

## 23. Analytics & Monitoring

### Event Tracking
- Track key user actions: screen views, button taps, form submissions,
  errors, and feature usage.
- Use a centralized analytics utility so the provider can be swapped
  (Google Analytics, Mixpanel, PostHog) without changing component code:

```typescript
// src/lib/analytics.ts
export const analytics = {
  trackScreen(name: string) { /* provider-specific */ },
  trackEvent(name: string, params?: Record<string, unknown>) { /* ... */ },
  trackError(error: Error, context?: string) { /* ... */ },
  setUser(userId: string, traits?: Record<string, unknown>) { /* ... */ },
};
```

### Performance Monitoring
- Track and report:
  - **Time to Interactive (TTI)**: From app launch to first user interaction.
  - **API response times**: Flag slow endpoints (> 2s).
  - **JS errors**: Capture with global error handler and report.
  - **Crash-free sessions rate**: Target > 99.5%.

### Crash Reporting
- Integrate a crash reporting service (Sentry, Bugsnag, or Firebase
  Crashlytics via Capacitor plugin).
- Include breadcrumbs: recent user actions, navigation history, and network
  state at time of crash.
- Tag crashes with app version, device model, OS version, and network type.

---

## 24. App Update Strategy

### Over-the-Air (OTA) Updates
- For web-layer updates (JS/CSS/HTML), consider using Capawesome's Live Update
  plugin or Ionic Appflow for OTA updates without going through app store
  review.
- Implement an update check on app launch:

```typescript
// Pseudocode for update check:
const { currentVersion, latestVersion, updateUrl } = await checkForUpdate();
if (currentVersion < latestVersion) {
  if (isCriticalUpdate) {
    showForceUpdateDialog(updateUrl); // Block app until updated
  } else {
    showOptionalUpdateBanner(updateUrl); // Dismissible
  }
}
```

### Version Management
- Display the app version in settings/about screen.
- Send the app version with every API request (via custom header) so the
  backend can enforce minimum version requirements.
- Maintain a `CHANGELOG.md` for tracking user-facing changes.

---

## 25. Device-Specific Adaptation

### Screen Size Adaptation
- Support these breakpoints at minimum:
  - **Small phones**: 320px–374px (iPhone SE, older Android)
  - **Standard phones**: 375px–413px (iPhone 13/14, Pixel)
  - **Large phones**: 414px–480px (iPhone Pro Max, Galaxy Ultra)
  - **Tablets**: 768px+ (iPad, Android tablets)
- Test layouts at each breakpoint. Critical UI must not break or overflow.

### Platform Detection
- Use `Capacitor.getPlatform()` to detect `'ios'`, `'android'`, or `'web'`
  and adapt behavior:
  ```typescript
  import { Capacitor } from '@capacitor/core';

  const platform = Capacitor.getPlatform();

  // Example: Different status bar styling per platform
  if (platform === 'ios') {
    StatusBar.setStyle({ style: Style.Light });
  } else if (platform === 'android') {
    StatusBar.setBackgroundColor({ color: '#000000' });
  }
  ```

### Notch & Dynamic Island
- Test layouts with various notch/Dynamic Island configurations.
- Never place interactive elements in the notch/Dynamic Island area.
- Use `env(safe-area-inset-*)` consistently—not just `padding-top` but also
  for floating action buttons and bottom sheets.

### Dark/Light Mode Sync
- Sync the app theme with the device system preference by default.
- Allow users to override with an in-app setting (system / light / dark).
- Persist the user's theme choice in storage so it's restored on next launch.
- Ensure **all** screens, modals, and components respect dark mode—no
  white-background cards in dark mode.

---

## 26. Professional Polish Checklist

These details separate a professional app from a hobby project:

### Visual Polish
- [ ] Consistent spacing scale (4px / 8px / 12px / 16px / 24px / 32px / 48px).
- [ ] Consistent border radius across components.
- [ ] Smooth micro-animations on button press (scale 0.97 → 1.0).
- [ ] Loading skeletons match the shape of actual content.
- [ ] Empty states have illustrations and helpful CTAs (not just "No data").
- [ ] Error states have a retry button and helpful messaging.
- [ ] Toast notifications use consistent positioning (top on mobile).
- [ ] Tab bar has subtle haptic feedback on tap.

### Behavioral Polish
- [ ] Double-tap prevention on submit buttons (disable after first tap).
- [ ] Optimistic UI updates for toggles, likes, and quick actions.
- [ ] Form data preserved when navigating away and coming back.
- [ ] Search has debounced input (300ms) with a loading indicator.
- [ ] Lists remember scroll position on back navigation.
- [ ] Image loading uses blur-up or shimmer placeholder.
- [ ] Network errors show retry option, not just an error message.
- [ ] Logout clears all sensitive data and navigates to login.

### Production Readiness
- [ ] `console.log` statements removed or gated behind `NODE_ENV`.
- [ ] Error boundaries on every route segment.
- [ ] Source maps disabled in production builds (prevent reverse engineering).
- [ ] App icon and splash screen properly configured for all device sizes.
- [ ] Deep links tested and working on both platforms.
- [ ] Push notification permission requested at the right moment.
- [ ] App store metadata (description, screenshots, keywords) prepared.
