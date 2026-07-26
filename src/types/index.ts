// TypeScript types for Mendyr API responses, auth, and domain models

// ─── API Response ────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  meta: PaginationMeta | null;
  error: ApiError | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// ─── Auth ────────────────────────────────────

export interface JwtPayload {
  userId: string;
  publicId: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterPatientRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  state: string;
}

export interface RegisterNurseRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city?: string;
  state?: string;
  experience: string;
  qualifications: string;
  certifications: string;
  preferredContact?: string;
}

// ─── User ────────────────────────────────────

export interface UserPublic {
  publicId: string;
  email: string;
  phone: string | null;
  fullName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

// ─── Nurse ───────────────────────────────────

export interface NurseProfilePublic {
  publicId: string;
  user: UserPublic;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  experience: string | null;
  qualifications: string[];
  certifications: string[];
  verificationStatus: string;
  preferredContact: string | null;
  documents: NurseDocumentPublic[];
  createdAt: string;
}

export interface NurseDocumentPublic {
  publicId: string;
  type: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
  createdAt: string;
}

// ─── Patient ─────────────────────────────────

export interface PatientProfilePublic {
  publicId: string;
  user: UserPublic;
  address: string | null;
  city: string | null;
  state: string | null;
  registrationStatus: string;
  createdAt: string;
}

// ─── Service ─────────────────────────────────

export interface ServicePublic {
  publicId: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  heroImage: string | null;
  icon: string | null;
  features: string[];
  pricingRange: string | null;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

// ─── Contact ─────────────────────────────────

export interface ContactInquiryPublic {
  publicId: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

// ─── Waitlist ────────────────────────────────

export interface WaitlistEntryPublic {
  publicId: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  notified: boolean;
  createdAt: string;
}

// ─── Audit Log ───────────────────────────────

export interface AuditLogPublic {
  id: string;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  oldValue: unknown | null;
  newValue: unknown | null;
  ipAddress: string | null;
  createdAt: string;
}

// ─── Dashboard Stats ─────────────────────────

export interface DashboardStats {
  totalPatients: number;
  totalNurses: number;
  pendingVerifications: number;
  waitlistCount: number;
  newContacts: number;
  recentActivity: AuditLogPublic[];
}

// ─── Search ──────────────────────────────────

export interface SearchParams {
  entity: "nurses" | "patients" | "services" | "contacts" | "waitlist";
  q?: string;
  filters?: Record<string, string | string[]>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ─── Role & Permission ──────────────────────

export interface RolePublic {
  publicId: string;
  name: string;
  slug: string;
  description: string | null;
  hierarchy: number;
  isSystem: boolean;
  permissions: PermissionPublic[];
}

export interface PermissionPublic {
  publicId: string;
  resource: string;
  action: string;
  description: string | null;
}

// ─── Nurse Appointments & Clinical Care ─────

export type AppointmentStatus =
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface AppointmentPublic {
  publicId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientAvatar?: string | null;
  patientPhone?: string;
  serviceName: string;
  serviceSlug: string;
  date: string; // ISO date or formatted string
  timeSlot: string; // e.g. "09:00 AM - 01:00 PM"
  durationHours: number;
  location: {
    address: string;
    city: string;
    state: string;
    distanceKm?: number;
  };
  payoutAmount: number;
  status: AppointmentStatus;
  specialInstructions?: string;
  medicalConditions?: string[];
  rejectionReason?: string;
  checkInTime?: string;
  checkOutTime?: string;
  careNotes?: CareNotePublic[];
  createdAt: string;
}

export interface CareNotePublic {
  id: string;
  timestamp: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    oxygenSaturation?: string;
  };
  medicationsAdministered?: string[];
  notes: string;
  authorName: string;
}

// ─── Nurse Earnings & Payouts ───────────────

export interface EarningTransactionPublic {
  id: string;
  appointmentId: string;
  patientName: string;
  serviceName: string;
  date: string;
  amount: number;
  status: "PAID" | "PROCESSING" | "PENDING";
  paymentMethod?: string;
}

export interface NurseEarningsSummary {
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
  completedVisitsCount: number;
  transactions: EarningTransactionPublic[];
}

