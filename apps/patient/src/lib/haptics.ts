import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Fire-and-forget tactile feedback for taps on native platforms. No-op on
// web so this can be called unconditionally from shared components.
export function hapticTap(style: ImpactStyle = ImpactStyle.Light) {
  if (!Capacitor.isNativePlatform()) return;
  Haptics.impact({ style }).catch(() => {});
}
