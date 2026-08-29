"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";

// Mounted once at the root layout. Wires up everything that makes the
// Capacitor build behave like a native app instead of a website in a frame:
// hardware back button, status bar styling, splash screen handoff, and
// keyboard-aware layout adjustments.
export function NativeAppBootstrap() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    document.documentElement.classList.add("is-native-app");

    // App background is light, so status bar text/icons must be dark to stay legible.
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    StatusBar.setBackgroundColor({ color: "#F7F9FC" }).catch(() => {});

    // The splash screen is set to launchAutoHide: false in capacitor.config.ts
    // so it stays up until React has actually painted the first frame,
    // avoiding a flash of blank white before hydration.
    const hideSplash = () => SplashScreen.hide().catch(() => {});
    const raf = requestAnimationFrame(hideSplash);

    const backButtonListener = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        // Use Next's router (not raw window.history.back()) so the App
        // Router's client-side cache/state stays in sync with the URL the
        // hardware back button navigates to — mixing the two can otherwise
        // leave the screen showing stale content after a back press.
        router.back();
      } else {
        Dialog.confirm({
          title: "Exit App",
          message: "Are you sure you want to exit?",
        }).then(({ value }) => {
          if (value) {
            App.exitApp();
          }
        });
      }
    });

    const keyboardShowListener = Keyboard.addListener("keyboardWillShow", () => {
      document.documentElement.classList.add("keyboard-open");
    });
    const keyboardHideListener = Keyboard.addListener("keyboardWillHide", () => {
      document.documentElement.classList.remove("keyboard-open");
    });

    return () => {
      cancelAnimationFrame(raf);
      backButtonListener.then((l) => l.remove());
      keyboardShowListener.then((l) => l.remove());
      keyboardHideListener.then((l) => l.remove());
    };
  }, [router]);

  return null;
}
