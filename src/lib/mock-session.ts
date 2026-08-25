import type { UserPublic } from "@/types";

// Dummy client-side session storage, used only when there's no backend to
// actually issue an httpOnly cookie session. See src/lib/mock-users.ts.
const MOCK_SESSION_KEY = "mendyr_mock_session";

export function saveMockSession(user: UserPublic): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
}

export function getMockSession(): UserPublic | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(MOCK_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserPublic;
  } catch {
    return null;
  }
}

export function clearMockSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MOCK_SESSION_KEY);
}
