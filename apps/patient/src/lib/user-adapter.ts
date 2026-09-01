import type { UserPublic } from '@/types';
import type { Role } from '@/lib/mock-users';

// Shape of `app/schemas/user.py`'s `UserRead` on the wire: snake_case, and `role`/`status`
// are lowercase enum values (`UserRole`/`UserStatus` in `app/core/constants.py`), not the
// uppercase `Role` union (`'PATIENT' | 'NURSE' | 'ADMIN' | 'SUPER_ADMIN'`) the rest of this
// app — nav link selection, `ROLE_DASHBOARD_PATH`, the mock-session fallback — expects.
// Adapting once here, rather than at every call site, is what stands between a real login
// and `getNavLinksForRole()` silently returning an empty nav for every real user.
interface BackendUser {
  id: string;
  phone_number: string | null;
  email: string | null;
  email_verified: boolean;
  full_name: string;
  gender: string;
  date_of_birth: string | null;
  avatar_url: string | null;
  referral_code: string;
  role: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

// Backend has no "professional specialization" or "super admin" concept at the account-role
// level — `professional` covers nurse/physio/caretaker/etc. (chosen later during KYC
// onboarding), and there is no distinct super-admin role, only `admin`/`ops`. Until the
// backend grows those concepts, both collapse to their closest existing app role.
const BACKEND_ROLE_TO_APP_ROLE: Record<string, Role> = {
  patient: 'PATIENT',
  professional: 'NURSE',
  admin: 'ADMIN',
  ops: 'ADMIN',
};

export function adaptBackendRole(role: string): Role {
  return BACKEND_ROLE_TO_APP_ROLE[role.toLowerCase()] ?? 'PATIENT';
}

export function adaptBackendUser(raw: BackendUser): UserPublic {
  return {
    publicId: raw.id,
    email: raw.email ?? '',
    phone: raw.phone_number,
    fullName: raw.full_name,
    gender: raw.gender,
    dateOfBirth: raw.date_of_birth,
    role: adaptBackendRole(raw.role),
    status: raw.status.toUpperCase(),
    emailVerified: raw.email_verified,
    avatarUrl: raw.avatar_url,
    referralCode: raw.referral_code,
    lastLoginAt: raw.last_login_at,
    createdAt: raw.created_at,
  };
}
