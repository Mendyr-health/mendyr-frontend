import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { apiFetch } from '@/lib/api-client';

// Push delivery: Capacitor's PushNotifications plugin gets a raw platform token — FCM on
// Android, and (once a matching Firebase project has APNs configured) FCM-wrapped-APNs on
// iOS too, so both platforms register through the same JS API. The backend already has the
// receiving side built: POST /api/v1/users/me/devices persists the token (app/models/user.py
// DeviceToken) and app/services/notification_service.py sends through Firebase Cloud
// Messaging from there — this module is the missing piece that gets a token registered.
//
// Requires a Firebase project wired into the native shells before it does anything for
// real (see docs/PUSH_NOTIFICATIONS.md) — until then `register()` throws early and callers
// no-op, so this is safe to call speculatively on every login.

async function registerDeviceToken(token: string): Promise<void> {
  const platform = Capacitor.getPlatform(); // "ios" | "android"
  await apiFetch('/api/v1/users/me/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, pushToken: token }),
  });
}

/** Deep-link target for a tapped notification, derived from the backend's `data` payload
 * (see app/services/notification_service.py's `template_key` values). Returns null for
 * template keys this app doesn't have a specific screen for — caller falls back to the
 * dashboard root. */
function deepLinkForNotification(data: Record<string, string>): string | null {
  switch (data.template_key) {
    case 'offer_received':
      return '/nurse/appointments';
    case 'booking_confirmed':
    case 'booking_status':
      // No dedicated per-booking patient appointments page yet — the dashboard surfaces
      // upcoming appointments inline, so that's the closest real screen to land on.
      return '/patient';
    default:
      return null;
  }
}

/** Call once, after login, from a client component that has access to the Next.js router
 * (see the (dashboard) layout). No-ops entirely on web — push tokens are a native-only
 * concept here. */
export async function initPushNotifications(onDeepLink: (path: string) => void): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const permission = await PushNotifications.checkPermissions();
  if (permission.receive !== 'granted') {
    const requested = await PushNotifications.requestPermissions();
    if (requested.receive !== 'granted') return;
  }

  await PushNotifications.addListener('registration', (token) => {
    registerDeviceToken(token.value).catch(() => {
      // Best-effort: a failed registration just means this device won't receive pushes
      // until the next app launch retries it — not worth surfacing to the user.
    });
  });

  await PushNotifications.addListener('registrationError', () => {
    // Firebase not configured yet, or the platform denied registration outright — see
    // docs/PUSH_NOTIFICATIONS.md for native-side setup. Nothing actionable for the user.
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    const path = deepLinkForNotification(action.notification.data as Record<string, string>);
    if (path) onDeepLink(path);
  });

  await PushNotifications.register();
}
