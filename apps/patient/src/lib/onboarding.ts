import type { UserPublic } from '@/types';

// Whether the account already has the details the "tell us about yourself" step collects.
//
// This used to be a per-device localStorage flag, written when the form was submitted and
// never read from the backend — a leftover from before there was an API to persist a profile
// on. The effect was that a fresh install (or a second device, or cleared site data) sent
// every existing user back through onboarding even though the server already held their
// profile, and the answers they gave were only ever stored locally, so it asked again the
// next time. Registration collects these same fields, so most users were being asked twice
// for data the backend already had.
//
// Gender is deliberately not required: "prefer not to say" is a legitimate answer that the
// backend stores as `unspecified`, so treating it as missing would trap those users in a
// loop they can't get out of by filling the form in.
export function isProfileComplete(user: UserPublic | null): boolean {
  if (!user) return false;
  return Boolean(user.fullName && user.phone && user.dateOfBirth);
}
