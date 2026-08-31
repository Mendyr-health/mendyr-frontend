'use client';
import { useState, useEffect, useCallback } from 'react';
import type { UserPublic } from '@/types';
import { apiFetch } from '@/lib/api-client';
import { getMockSession, clearMockSession } from '@/lib/mock-session';
import { adaptBackendUser } from '@/lib/user-adapter';

export function useAuth() {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(adaptBackendUser(data.data));
      } else {
        setUser(null);
      }
    } catch {
      // No backend reachable — fall back to the dummy session created by
      // the login page's mock fallback, if one exists, instead of forcing
      // the user back out to /login.
      setUser(getMockSession());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearMockSession();
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  // Backend field names (app/schemas/user.py UserUpdateIn) — snake_case, unlike the rest of
  // this app's camelCase. Kept as a small boundary adapter here rather than exposing the raw
  // wire shape to every profile-editing screen that calls this.
  const updateProfile = useCallback(
    async (updates: {
      fullName?: string;
      phone?: string;
      email?: string;
      gender?: 'male' | 'female' | 'other' | 'unspecified';
    }) => {
      const body: Record<string, unknown> = {};
      if (updates.fullName !== undefined) body.full_name = updates.fullName;
      if (updates.phone !== undefined) body.phone_number = updates.phone;
      if (updates.email !== undefined) body.email = updates.email;
      if (updates.gender !== undefined) body.gender = updates.gender;

      const res = await apiFetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update profile.');
      }
      setUser(adaptBackendUser(data.data));
      return adaptBackendUser(data.data);
    },
    [],
  );

  return { user, loading, logout, refreshUser, updateProfile, isAuthenticated: !!user };
}
