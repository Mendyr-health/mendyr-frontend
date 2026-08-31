import type { UserPublic } from '@/types';

// There is no backend yet. This lets the app be exercised end-to-end with
// dummy data: if a real API call fails to even reach a server (network
// error, not an auth rejection), the login flow falls back to a mock user
// instead of dead-ending. Once a real backend exists, `apiFetch` calls will
// resolve normally and this fallback simply never triggers.
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'NURSE' | 'PATIENT';

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  SUPER_ADMIN: '/super-admin',
  ADMIN: '/admin',
  NURSE: '/nurse',
  PATIENT: '/patient',
};

// Dev convenience: typing an email containing one of these keywords picks
// that role for the mock session, so you can test any dashboard from the
// login screen without a backend, e.g. "nurse@test.com" or "admin@test.com".
export function inferRoleFromEmail(email: string): Role {
  const lower = email.toLowerCase();
  if (lower.includes('super')) return 'SUPER_ADMIN';
  if (lower.includes('admin')) return 'ADMIN';
  if (lower.includes('nurse') || lower.includes('pharmacist') || lower.includes('doctor'))
    return 'NURSE';
  return 'PATIENT';
}

const ROLE_MOCK_NAMES: Record<Role, string> = {
  SUPER_ADMIN: 'Aisha Khan',
  ADMIN: 'Rohan Verma',
  NURSE: 'Priya Sharma',
  PATIENT: 'Kabir Malhotra',
};

export function getMockUserForRole(role: Role, email: string): UserPublic {
  return {
    publicId: `mock-${role.toLowerCase()}-001`,
    email,
    phone: null,
    fullName: ROLE_MOCK_NAMES[role],
    role,
    status: 'ACTIVE',
    emailVerified: true,
    avatarUrl: null,
    referralCode: `MOCK${role.slice(0, 4)}`,
    lastLoginAt: null,
    createdAt: '2025-01-15T00:00:00.000Z',
  };
}
