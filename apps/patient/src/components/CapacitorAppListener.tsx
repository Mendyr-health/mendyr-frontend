"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";

export function CapacitorAppListener() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const listener = App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
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

      return () => {
        listener.then((l) => l.remove());
      };
    }
  }, []);

  return null;
}
