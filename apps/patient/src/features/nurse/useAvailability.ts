import { useState } from 'react';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const SLOTS = [
  'Morning (6AM-12PM)',
  'Afternoon (12PM-6PM)',
  'Evening (6PM-12AM)',
  'Night (12AM-6AM)',
];

export function useAvailability() {
  const [schedule, setSchedule] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {};
    DAYS.forEach((day) => {
      initial[day] = SLOTS.map(() => false);
    });
    return initial;
  });

  const toggle = (day: string, slotIdx: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((v, i) => (i === slotIdx ? !v : v)),
    }));
  };

  return {
    schedule,
    toggle,
    DAYS,
    SLOTS,
  };
}
