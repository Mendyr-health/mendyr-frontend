import { differenceInYears, startOfDay, subYears } from "date-fns";

export const MINIMUM_AGE = 18;
export const MAXIMUM_AGE = 55;

export function getDateOfBirthRange(today = new Date()) {
  const currentDay = startOfDay(today);

  return {
    earliestDate: subYears(currentDay, MAXIMUM_AGE),
    latestDate: subYears(currentDay, MINIMUM_AGE),
  };
}

export function isEligibleDateOfBirth(date: Date, today = new Date()) {
  const age = differenceInYears(today, date);
  return age >= MINIMUM_AGE && age <= MAXIMUM_AGE;
}
