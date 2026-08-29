# Push notifications

The plumbing on both ends is built. What's missing is a real Firebase project — that part
needs a human with console access, so it's written up here rather than done in code.

## What's already built

**Backend** (`Mendyr-Backend`) — pre-existing, no changes needed:
- `app/models/user.py`'s `DeviceToken` stores one row per registered device per user.
- `POST /api/v1/users/me/devices` (`app/api/v1/endpoints/users.py`) registers a token —
  body is `{ platform, pushToken, appVersion? }` (camelCase; see `app/schemas/user.py`'s
  `DeviceTokenIn`).
- `app/services/notification_service.py` sends through `app/integrations/push/fcm.py`
  (Firebase Cloud Messaging HTTP v1 API) whenever a booking offer/status changes, and logs
  every send as an `app/models/notification.py` row. With no `FCM_PROJECT_ID` configured it
  no-ops and logs instead of sending — safe in dev.

**Frontend** (this repo) — added this session:
- `@capacitor/push-notifications` installed and synced into `android/`.
- `src/lib/push-notifications.ts` — requests permission, registers for a token, POSTs it to
  the backend, and deep-links the app to the right screen when a notification is tapped
  (`pushNotificationActionPerformed`), keyed off the backend's `template_key` field.
- Wired into `src/app/(dashboard)/layout.tsx`: fires once a logged-in `user` is available
  (push tokens need to be associated with an account, so this can't run pre-login).
- `android/app/build.gradle` already had the Capacitor template's conditional
  `google-services` Gradle plugin application (applies only if `google-services.json`
  exists) — that part predates this session and needed no change.

## What's NOT done — needs a human with Firebase/Apple Developer console access

1. **Create a Firebase project** (console.firebase.google.com) with two Android apps
   registered — package names `com.mendyr.patient` and `com.mendyr.provider` (see
   `capacitor.config.ts`'s `APP_IDENTITY`) — plus matching iOS apps once bundle IDs are
   finalized for the iOS builds.
2. **Android**: download each app's `google-services.json` and place it at
   `android/app/google-services.json` before running `npm run sync:patient` /
   `npm run sync:provider` for that target's build (the two apps need their own file —
   swap it in before each target's build, or keep both and select per-target the same way
   `native:target:<target>` already does for the app id/name).
3. **iOS**: download `GoogleService-Info.plist` and add it to the Xcode project
   (`ios/App/App/`), then in Firebase console → Project Settings → Cloud Messaging, upload
   an APNs authentication key (from Apple Developer → Certificates, Identifiers & Profiles
   → Keys) — FCM relays through APNs on iOS, so without that key iOS registration will fail
   even with the plist in place. This machine doesn't have CocoaPods installed
   (`brew install cocoapods`), which blocked running `npx cap sync ios` this session — only
   `npx cap sync android` was run and verified. Run `npx cap sync ios` once CocoaPods is
   available, before the plist step will take effect.
4. **Backend**: set `FCM_PROJECT_ID` (and whatever service-account credential
   `app/integrations/push/fcm.py`'s HTTP v1 call needs — check that file; it currently
   assumes a bearer token is available some other way, e.g. Application Default
   Credentials, which itself needs a service account key configured in the deploy
   environment) in the backend's environment once the Firebase project exists.

Until all four are done, `initPushNotifications()` still runs safely — permission
request and `PushNotifications.register()` will simply fail silently
(`registrationError` listener, currently a no-op) since there's no Firebase config for the
native SDK to talk to.
