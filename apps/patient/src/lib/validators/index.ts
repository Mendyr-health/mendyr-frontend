import { z } from 'zod';
import {
  isEligibleDateOfBirth,
  isEligibleProfessionalDateOfBirth,
  PATIENT_MAXIMUM_AGE,
  PATIENT_MINIMUM_AGE,
  PROFESSIONAL_MAXIMUM_AGE,
  PROFESSIONAL_MINIMUM_AGE,
} from '@/lib/date-of-birth';

// ── Common ───────────────────────────────────────

const emailSchema = z.string().email('Invalid email address').max(255);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100);

// ── Auth ─────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const dateOfBirthSchema = z
  .date({ required_error: 'Date of birth is required' })
  .max(new Date(), 'Date of birth cannot be in the future');

// Patients and professionals have deliberately different eligible ranges — see
// lib/date-of-birth.ts. Sharing one schema previously capped patient registration at 55,
// which would reject most of the app's actual (elderly-skewing) patient base.
const eligiblePatientDateOfBirthSchema = dateOfBirthSchema.refine(isEligibleDateOfBirth, {
  message: `You must be between ${PATIENT_MINIMUM_AGE} and ${PATIENT_MAXIMUM_AGE} years old`,
});

const eligibleProfessionalDateOfBirthSchema = dateOfBirthSchema.refine(
  isEligibleProfessionalDateOfBirth,
  {
    message: `You must be between ${PROFESSIONAL_MINIMUM_AGE} and ${PROFESSIONAL_MAXIMUM_AGE} years old`,
  },
);

export const patientRegistrationFormSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: z.string().min(10, 'Invalid phone number').max(15, 'Invalid phone number'),
  password: passwordSchema,
  dob: eligiblePatientDateOfBirthSchema,
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  referralCode: z.string().max(12).optional().or(z.literal('')),
});

export const nurseRegistrationFormSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: z.string().min(10, 'Invalid phone number').max(15, 'Invalid phone number'),
  password: passwordSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  dateOfBirth: eligibleProfessionalDateOfBirthSchema,
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  experience: z.string().min(2, 'Experience is required').max(1000),
  qualifications: z.string().min(2, 'Qualifications are required').max(2000),
  certifications: z.string().max(2000),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']),
});

export const registerPatientSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: z.string().regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number'),
  password: passwordSchema,
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
});

export const registerNurseSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: z.string().regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number'),
  password: passwordSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  dateOfBirth: z.string().refine(
    (val) => {
      const date = new Date(val);
      return isEligibleDateOfBirth(date);
    },
    { message: 'You must be between 18 and 55 years old' },
  ),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  experience: z.string().min(2, 'Experience is required').max(1000),
  qualifications: z.string().min(2, 'Qualifications are required').max(2000),
  certifications: z.string().max(2000).optional().default(''),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  password: passwordSchema,
});

// ── Service ──────────────────────────────────────

export const createServiceSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10).max(5000),
  shortDesc: z.string().max(300).optional(),
  heroImage: z.string().url().optional().or(z.literal('')),
  icon: z.string().max(50).optional(),
  features: z.array(z.string()).optional(),
  pricingRange: z.string().max(100).optional(),
  isActive: z.boolean().optional().default(true),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
  seoKeywords: z.string().max(500).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

// ── Contact ──────────────────────────────────────

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  notes: z.string().max(2000).optional(),
});

// ── Waitlist ─────────────────────────────────────

export const waitlistSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  phone: phoneSchema,
  source: z.string().max(50).optional(),
});

// ── User Management ──────────────────────────────

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL', 'PENDING_VERIFICATION']),
});

export const createAdminSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

// ── Nurse Verification ──────────────────────────

export const verifyNurseSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'UNDER_REVIEW']),
  rejectionReason: z.string().max(1000).optional(),
});

// ── Nurse Profile Update ────────────────────────

export const updateNurseProfileSchema = z.object({
  fullName: nameSchema.optional(),
  phone: phoneSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  experience: z.string().max(1000).optional(),
  qualifications: z.string().max(2000).optional(),
  certifications: z.string().max(2000).optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
  availabilityPrefs: z.string().max(5000).optional(),
});

// ── Patient Profile Update ──────────────────────

export const updatePatientProfileSchema = z.object({
  fullName: nameSchema.optional(),
  phone: phoneSchema,
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
});

// ── Roles & Permissions ─────────────────────────

export const createRoleSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  hierarchy: z.number().int().min(0).max(99).optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

// ── System Settings ─────────────────────────────

export const updateSettingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
    }),
  ),
});

// ── Search ───────────────────────────────────────

export const searchParamsSchema = z.object({
  entity: z.enum(['nurses', 'patients', 'services', 'contacts', 'waitlist']),
  q: z.string().max(200).optional(),
  filters: z.record(z.union([z.string(), z.array(z.string()), z.boolean()])).optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// ── Pagination Query ────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;
export type RegisterNurseInput = z.infer<typeof registerNurseSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
