import { differenceInYears, startOfDay, subYears } from 'date-fns';

// Patients skew heavily elderly — post-surgery care, chronic-condition management, and
// general elder care are core home-healthcare use cases, not edge cases — so this range is
// deliberately wide (an upper bound exists only as a basic sanity check, not a business
// rule). Nurses/professionals get a separate, working-age-appropriate range below; the two
// must not share one constant, which is what previously capped patient registration at 55
// and would have rejected most of the app's actual target audience.
export const PATIENT_MINIMUM_AGE = 18;
export const PATIENT_MAXIMUM_AGE = 100;

export const PROFESSIONAL_MINIMUM_AGE = 18;
export const PROFESSIONAL_MAXIMUM_AGE = 65;

export function getDateOfBirthRange(
  today = new Date(),
  minAge = PATIENT_MINIMUM_AGE,
  maxAge = PATIENT_MAXIMUM_AGE,
) {
  const currentDay = startOfDay(today);

  return {
    earliestDate: subYears(currentDay, maxAge),
    latestDate: subYears(currentDay, minAge),
  };
}

export function isEligibleDateOfBirth(
  date: Date,
  today = new Date(),
  minAge = PATIENT_MINIMUM_AGE,
  maxAge = PATIENT_MAXIMUM_AGE,
) {
  const age = differenceInYears(today, date);
  return age >= minAge && age <= maxAge;
}

export function isEligibleProfessionalDateOfBirth(date: Date, today = new Date()) {
  return isEligibleDateOfBirth(date, today, PROFESSIONAL_MINIMUM_AGE, PROFESSIONAL_MAXIMUM_AGE);
}

export function getProfessionalDateOfBirthRange(today = new Date()) {
  return getDateOfBirthRange(today, PROFESSIONAL_MINIMUM_AGE, PROFESSIONAL_MAXIMUM_AGE);
}
