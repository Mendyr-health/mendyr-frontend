import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_ORIGIN}/api/v1/`,
    // Cookies must be sent explicitly: the Capacitor native shells load the
    // app from a different origin than the API, so this isn't same-origin.
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Tokens are handled via httpOnly cookies in Mendyr architecture,
      // so we don't need to manually attach an Authorization header here.
      // We can attach CSRF tokens or other generic headers if needed.
      return headers;
    },
  }),
  tagTypes: ['User', 'Patient', 'Nurse', 'Admin', 'Service', 'Waitlist', 'Contact', 'Settings'],
  endpoints: () => ({}),
});
