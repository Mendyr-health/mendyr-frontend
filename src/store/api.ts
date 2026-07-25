import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/",
    prepareHeaders: (headers) => {
      // Tokens are handled via httpOnly cookies in Mendyr architecture,
      // so we don't need to manually attach an Authorization header here.
      // We can attach CSRF tokens or other generic headers if needed.
      return headers;
    },
  }),
  tagTypes: ["User", "Patient", "Nurse", "Admin", "Service", "Waitlist", "Contact", "Settings"],
  endpoints: () => ({}),
});
