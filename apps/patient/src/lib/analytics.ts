/**
 * Google Analytics 4 event helper functions.
 * Works with @next/third-parties/google integration.
 * Only fires events client-side.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GAEventParams = Record<string, string | number | boolean>;

function trackEvent(eventName: string, params?: GAEventParams): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}

// ── Auth Events ──────────────────────────────────

export function trackSignUp(method: string, role: string): void {
  trackEvent('sign_up', { method, role });
}

export function trackLogin(method: string): void {
  trackEvent('login', { method });
}

// ── Registration Events ──────────────────────────

export function trackNurseApplication(): void {
  trackEvent('nurse_application', { step: 'submitted' });
}

export function trackPatientRegistration(): void {
  trackEvent('patient_registration', { step: 'submitted' });
}

// ── Engagement Events ────────────────────────────

export function trackWaitlistJoin(source: string): void {
  trackEvent('waitlist_join', { source });
}

export function trackContactFormSubmit(): void {
  trackEvent('contact_form_submit');
}

export function trackServiceView(serviceName: string, serviceSlug: string): void {
  trackEvent('service_view', { service_name: serviceName, service_slug: serviceSlug });
}

export function trackSearch(query: string, entity: string, resultCount: number): void {
  trackEvent('search', { search_term: query, entity, result_count: resultCount });
}

// ── Page View (custom) ──────────────────────────

export function trackPageView(path: string, title: string): void {
  trackEvent('page_view', { page_path: path, page_title: title });
}
