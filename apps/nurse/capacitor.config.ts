import type { CapacitorConfig } from '@capacitor/cli';
import { Style } from '@capacitor/status-bar';
import { KeyboardResize } from '@capacitor/keyboard';

// Mendyr ships as two separate apps built from this one codebase: a
const config: CapacitorConfig = {
  appId: 'com.mendyr.provider',
  appName: 'Mendyr Pro',
  webDir: '../patient/out',
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
