import * as yup from "yup";

// ── Common field schemas ─────────────────────────

const emailField = yup
  .string()
  .required("Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be at most 255 characters");

const passwordField = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const nameField = yup
  .string()
  .required("Full name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters");

const phoneField = yup
  .string()
  .required("Phone number is required")
  .matches(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number");

// ── Login Schema ─────────────────────────────────

export const loginSchema = yup.object({
  email: emailField,
  password: yup.string().required("Password is required").min(1, "Password is required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

// ── Patient Registration Schema ──────────────────

export const patientRegisterStep1Schema = yup.object({
  fullName: nameField,
  email: emailField,
  phone: phoneField,
  password: passwordField,
});

export const patientRegisterStep2Schema = yup.object({
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be at most 100 characters"),
});

export const patientRegisterSchema = patientRegisterStep1Schema.concat(
  patientRegisterStep2Schema
);

export type PatientRegisterFormValues = yup.InferType<typeof patientRegisterSchema>;

// ── Nurse Registration Schema ────────────────────

export const nurseRegisterStep1Schema = yup.object({
  fullName: nameField,
  email: emailField,
  phone: phoneField,
  password: passwordField,
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], "Please select a valid gender"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("age-range", "Nurse must be between 18 and 70 years old", (val) => {
      if (!val) return false;
      const date = new Date(val);
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 18 && age <= 70;
    }),
});

export const nurseRegisterStep2Schema = yup.object({
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(500),
  city: yup.string().max(100).default(""),
  state: yup.string().max(100).default(""),
  experience: yup
    .string()
    .required("Experience is required")
    .min(2, "Experience must be at least 2 characters")
    .max(1000),
  qualifications: yup
    .string()
    .required("Qualifications are required")
    .min(2, "Qualifications must be at least 2 characters")
    .max(2000),
  certifications: yup.string().max(2000).default(""),
  preferredContact: yup
    .string()
    .oneOf(["email", "phone", "whatsapp"], "Please select a valid contact method")
    .default("email"),
});

export const nurseRegisterSchema = nurseRegisterStep1Schema.concat(
  nurseRegisterStep2Schema
);

export type NurseRegisterFormValues = yup.InferType<typeof nurseRegisterSchema>;
