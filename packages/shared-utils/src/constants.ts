export const APP_NAME = 'Mendyr';
export const APP_DESCRIPTION =
  'Connecting patients with verified nurses and caregivers for at-home healthcare services.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const JWT_COOKIE_NAME = 'mendyr_access_token';
export const REFRESH_COOKIE_NAME = 'mendyr_refresh_token';
export const OTP_EXPIRY_SECONDS = 300;
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const RATE_LIMITS = {
  login: { max: Number(process.env.RATE_LIMIT_LOGIN) || 5, windowMs: 60_000 },
  register: { max: Number(process.env.RATE_LIMIT_REGISTER) || 3, windowMs: 3_600_000 },
  api: { max: Number(process.env.RATE_LIMIT_API) || 100, windowMs: 60_000 },
} as const;

export const CACHE_TTL = { search: 60, service: 300, dashboard: 120, user: 180 } as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  NURSE: 2,
  PATIENT: 3,
};

export const PERMISSIONS = {
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  NURSE_READ: 'nurse:read',
  NURSE_UPDATE: 'nurse:update',
  NURSE_APPROVE: 'nurse:approve',
  NURSE_REJECT: 'nurse:reject',
  PATIENT_READ: 'patient:read',
  PATIENT_UPDATE: 'patient:update',
  SERVICE_CREATE: 'service:create',
  SERVICE_READ: 'service:read',
  SERVICE_UPDATE: 'service:update',
  SERVICE_DELETE: 'service:delete',
  CONTACT_READ: 'contact:read',
  CONTACT_UPDATE: 'contact:update',
  WAITLIST_READ: 'waitlist:read',
  WAITLIST_UPDATE: 'waitlist:update',
  WAITLIST_EXPORT: 'waitlist:export',
  ADMIN_CREATE: 'admin:create',
  ADMIN_READ: 'admin:read',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_SUSPEND: 'admin:suspend',
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  AUDIT_READ: 'audit:read',
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.NURSE_READ,
    PERMISSIONS.NURSE_UPDATE,
    PERMISSIONS.NURSE_APPROVE,
    PERMISSIONS.NURSE_REJECT,
    PERMISSIONS.PATIENT_READ,
    PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_UPDATE,
    PERMISSIONS.SERVICE_DELETE,
    PERMISSIONS.CONTACT_READ,
    PERMISSIONS.CONTACT_UPDATE,
    PERMISSIONS.WAITLIST_READ,
    PERMISSIONS.WAITLIST_UPDATE,
    PERMISSIONS.WAITLIST_EXPORT,
    PERMISSIONS.AUDIT_READ,
  ],
  NURSE: [PERMISSIONS.NURSE_READ, PERMISSIONS.NURSE_UPDATE, PERMISSIONS.SERVICE_READ],
  PATIENT: [PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_UPDATE, PERMISSIONS.SERVICE_READ],
};

export const HEALTHCARE_SERVICES = [
  {
    name: 'Home Nursing',
    slug: 'home-nursing',
    shortDesc: 'Professional nursing care delivered to your doorstep',
    description:
      'Our verified and experienced nurses provide comprehensive healthcare services right at your home. From post-surgical care to chronic disease management, we ensure you receive hospital-quality nursing in the comfort of your home.',
    icon: 'Heart',
    features: [
      '24/7 nursing care availability',
      'Wound care and dressing',
      'IV therapy and injections',
      'Vital signs monitoring',
      'Medication management',
      'Post-surgical care',
    ],
    pricingRange: '₹800 – ₹3,000/day',
  },
  {
    name: 'Elder Care Support',
    slug: 'elder-care-support',
    shortDesc: 'Compassionate care for your loved ones',
    description:
      'Dedicated caregivers who provide personalized support for elderly family members. Our elder care services ensure safety, comfort, and companionship while helping seniors maintain their independence and dignity at home.',
    icon: 'Users',
    features: [
      'Daily living assistance',
      'Companionship and emotional support',
      'Mobility assistance',
      'Meal preparation and nutrition',
      'Hygiene and personal care',
      'Fall prevention and safety',
    ],
    pricingRange: '₹600 – ₹2,000/day',
  },
  {
    name: 'Physiotherapy',
    slug: 'physiotherapy',
    shortDesc: 'Rehabilitation and recovery at home',
    description:
      'Licensed physiotherapists bring professional rehabilitation services to your home. Whether recovering from surgery, managing chronic pain, or improving mobility, our therapists create personalized treatment plans for optimal recovery.',
    icon: 'Activity',
    features: [
      'Post-surgical rehabilitation',
      'Chronic pain management',
      'Stroke recovery programs',
      'Sports injury treatment',
      'Mobility and strength training',
      'Home exercise programs',
    ],
    pricingRange: '₹700 – ₹1,500/session',
  },
  {
    name: 'Post-Operative Care',
    slug: 'post-operative-care',
    shortDesc: 'Expert recovery support after surgery',
    description:
      'Specialized post-operative nursing care designed to support your recovery journey after surgery. Our trained nurses monitor your progress, manage pain, prevent complications, and ensure a smooth transition from hospital to home.',
    icon: 'Stethoscope',
    features: [
      'Surgical wound management',
      'Pain monitoring and management',
      'Complication prevention',
      'Mobility rehabilitation',
      'Nutrition and diet guidance',
      'Doctor coordination',
    ],
    pricingRange: '₹1,000 – ₹4,000/day',
  },
  {
    name: 'Medical Equipment Rental',
    slug: 'medical-equipment-rental',
    shortDesc: 'Quality medical equipment for home use',
    description:
      'Access hospital-grade medical equipment for home use without the burden of purchase. We offer well-maintained, sanitized equipment with delivery, setup, and training included to support your care needs at home.',
    icon: 'Wrench',
    features: [
      'Hospital beds and mattresses',
      'Oxygen concentrators',
      'Wheelchairs and walkers',
      'Patient monitors',
      'Nebulizers and CPAP machines',
      'Delivery and setup included',
    ],
    pricingRange: '₹500 – ₹5,000/month',
  },
  {
    name: 'Emergency Assistance',
    slug: 'emergency-assistance',
    shortDesc: 'Rapid response healthcare support',
    description:
      'When medical situations arise unexpectedly, our emergency assistance team provides rapid response healthcare support. Trained professionals arrive quickly to stabilize, assess, and coordinate care until further medical help is available.',
    icon: 'AlertTriangle',
    features: [
      'Rapid response team',
      'First aid and stabilization',
      'Emergency vitals assessment',
      'Hospital transfer coordination',
      '24/7 helpline access',
      'Critical care nurse dispatch',
    ],
    pricingRange: '₹2,000 – ₹8,000/visit',
  },
] as const;

export const PUBLIC_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Become a Nurse', href: '/become-a-nurse' },
  { label: 'Contact', href: '/contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Nurses', href: '/admin/nurses', icon: 'UserCheck' },
  { label: 'Patients', href: '/admin/patients', icon: 'Users' },
  { label: 'Services', href: '/admin/services', icon: 'Stethoscope' },
  { label: 'Waitlist', href: '/admin/waitlist', icon: 'ClipboardList' },
  { label: 'Contacts', href: '/admin/contacts', icon: 'Mail' },
] as const;

export const SUPER_ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/super-admin', icon: 'LayoutDashboard' },
  { label: 'Admins', href: '/super-admin/admins', icon: 'Shield' },
  { label: 'Roles', href: '/super-admin/roles', icon: 'Key' },
  { label: 'Permissions', href: '/super-admin/permissions', icon: 'Lock' },
  { label: 'Audit Logs', href: '/super-admin/audit-logs', icon: 'FileText' },
  { label: 'Settings', href: '/super-admin/settings', icon: 'Settings' },
] as const;

export const NURSE_NAV_LINKS = [
  { label: 'Dashboard', href: '/nurse', icon: 'LayoutDashboard' },
  { label: 'Appointments', href: '/nurse/appointments', icon: 'Calendar' },
  { label: 'Messages', href: '/nurse/messages', icon: 'MessageSquare' },
  { label: 'Availability', href: '/nurse/availability', icon: 'Clock' },
  { label: 'Earnings', href: '/nurse/earnings', icon: 'DollarSign' },
  { label: 'Documents', href: '/nurse/documents', icon: 'FileText' },
  { label: 'Status', href: '/nurse/status', icon: 'CheckCircle' },
  { label: 'Profile', href: '/nurse/profile', icon: 'User' },
  { label: 'Settings', href: '/nurse/settings', icon: 'Settings' },
] as const;

export const PATIENT_NAV_LINKS = [
  { label: 'Dashboard', href: '/patient', icon: 'LayoutDashboard' },
  { label: 'Appointments', href: '/patient/appointments', icon: 'Calendar' },
  { label: 'Messages', href: '/patient/messages', icon: 'MessageSquare' },
  { label: 'Profile', href: '/patient/profile', icon: 'User' },
  { label: 'Settings', href: '/patient/settings', icon: 'Settings' },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'When will Mendyr launch its services?',
    answer:
      'We are currently in our pre-launch phase and expect to begin full operations within the next 2–3 months. Sign up for our waitlist to be the first to know when we go live!',
  },
  {
    question: 'How can I register as a patient?',
    answer:
      "You can register by clicking the 'Get Started' button and filling out the patient registration form. Once registered, you'll be added to our waitlist and notified when services become available in your area.",
  },
  {
    question: 'How does Mendyr verify its nurses?',
    answer:
      'Every nurse on our platform undergoes a thorough verification process including background checks, credential verification, Aadhaar verification, and experience validation. Only approved nurses can provide services through Mendyr.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      "At launch, Mendyr will be available in select metropolitan areas. We are rapidly expanding our coverage. Join the waitlist to let us know your location and we'll prioritize areas with the highest demand.",
  },
  {
    question: 'How much do the services cost?',
    answer:
      'Our pricing varies by service type and duration. We believe in transparent pricing with no hidden charges. Visit our Services page for detailed pricing ranges for each service category.',
  },
  {
    question: 'Can I become a nurse on the Mendyr platform?',
    answer:
      "Absolutely! We welcome qualified and experienced nurses to join our platform. Click on 'Become a Nurse' to submit your application. Our team will review your credentials and get back to you.",
  },
  {
    question: 'Is my personal data safe with Mendyr?',
    answer:
      'Yes. We take data privacy very seriously. All personal and medical information is encrypted, securely stored, and handled in compliance with applicable data protection regulations. We never share your data without consent.',
  },
  {
    question: 'How do I contact Mendyr for support?',
    answer:
      'You can reach us through our Contact page, email us at support@mendyr.app, or call our helpline. We aim to respond to all inquiries within 24 hours.',
  },
] as const;
