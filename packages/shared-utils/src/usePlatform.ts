"use client";
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

export interface PlatformState {
  isWeb: boolean;
  isMobile: boolean;
  isCapacitor: boolean;
  isAndroid: boolean;
  isIOS: boolean;
}

export function usePlatform(): PlatformState {
  // Default to server-safe values for SSR/SSG.
  const [platform, setPlatform] = useState<PlatformState>({
    isWeb: true,
    isMobile: false,
    isCapacitor: false,
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    const isCapacitor = Capacitor.isNativePlatform();
    const platformName = Capacitor.getPlatform();

    setPlatform({
      isWeb: platformName === 'web',
      isMobile: isCapacitor, // Treating all native capacitor platforms as mobile
      isCapacitor: isCapacitor,
      isAndroid: platformName === 'android',
      isIOS: platformName === 'ios',
    });
  }, []);

  return platform;
}
