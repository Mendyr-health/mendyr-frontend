// Central HTTP client for talking to the Mendyr FastAPI backend.
//
// This app is shipped three ways: as a browser SPA, and bundled as a static
// export inside the Capacitor iOS/Android shells. In the native shells the
// page is served from a local scheme (capacitor://localhost / http://localhost)
// which is a different origin than the API server, so relative fetch("/api/...")
// calls silently fail — there is no same-origin proxy to catch them like there
// can be on the web. Every request must therefore be resolved against an
// absolute origin, and cookies must be sent explicitly cross-origin.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(apiUrl(path), {
    credentials: 'include',
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
}
