import type { CapacitorConfig } from '@capacitor/cli';
import { Style } from '@capacitor/status-bar';
import { KeyboardResize } from '@capacitor/keyboard';

// Mendyr ships as two separate apps built from this one codebase: a
// "patient" app and a "provider" app (nurses/pharmacists/doctors/admin
// staff) — see src/lib/app-target.ts for how the web bundle picks up the
// matching target. Which one `cap sync`/`cap open` targets is chosen by the
// CAPACITOR_APP_TARGET env var (set by the sync:patient / sync:provider npm
// scripts); this only re-identifies the single native project checked into
// android/ and ios/ — run `npm run native:target:<target>` (see
// scripts/apply-app-target.js) beforehand to also patch the native
// applicationId/bundle id and display name to match before building/signing.
const APP_TARGET = process.env.CAPACITOR_APP_TARGET === 'provider' ? 'provider' : 'patient';

const APP_IDENTITY = {
  patient: { appId: 'com.mendyr.patient', appName: 'Mendyr' },
  provider: { appId: 'com.mendyr.provider', appName: 'Mendyr Pro' },
} as const;

const config: CapacitorConfig = {
  ...APP_IDENTITY[APP_TARGET],
  webDir: 'out',
  plugins: {
    SplashScreen: {
      // We hide it manually from NativeAppBootstrap once the app has
      // mounted, so it never disappears before the UI is actually ready.
      launchAutoHide: false,
      backgroundColor: '#F7F9FC',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: false,
      // App background is light, so status bar text/icons must be dark to stay legible.
      style: Style.Light,
      backgroundColor: '#F7F9FC',
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
