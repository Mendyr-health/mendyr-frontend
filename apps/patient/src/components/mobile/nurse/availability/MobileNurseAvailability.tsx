'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import { useAvailability } from '@/features/nurse/useAvailability';

const dayFullNames: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export default function MobileNurseAvailability() {
  const { schedule, toggle, DAYS, SLOTS } = useAvailability();
  const [expandedDay, setExpandedDay] = useState<string>('Mon');

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-foreground text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground mt-1 text-sm">Set your working hours</p>
      </div>

      {/* Days Accordion List */}
      <div className="flex flex-col gap-3 px-2">
        {DAYS.map((day, idx) => {
          const isExpanded = expandedDay === day;
          const selectedCount = schedule[day].filter(Boolean).length;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-card overflow-hidden rounded-3xl border shadow-sm transition-colors ${
                isExpanded ? 'border-primary/50 ring-primary/20 ring-1' : 'border-border'
              }`}
            >
              <div
                className="active:bg-muted/50 flex cursor-pointer items-center justify-between p-4 transition-colors"
                onClick={() => setExpandedDay(isExpanded ? '' : day)}
              >
                <div>
                  <h3 className="text-foreground text-base font-bold">{dayFullNames[day]}</h3>
                  <p
                    className={`mt-0.5 text-xs font-medium ${selectedCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {selectedCount > 0 ? `${selectedCount} slots selected` : 'No slots selected'}
                  </p>
                </div>
                <div
                  className={`rounded-full p-2 transition-transform ${isExpanded ? 'bg-primary/10 text-primary rotate-180' : 'bg-muted text-muted-foreground'}`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-border/50 bg-muted/10 border-t"
                  >
                    <div className="grid grid-cols-1 gap-2 p-3">
                      {SLOTS.map((slot, slotIdx) => {
                        const isSelected = schedule[day][slotIdx];
                        return (
                          <div
                            key={slotIdx}
                            onClick={() => toggle(day, slotIdx)}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-all ${
                              isSelected
                                ? 'bg-primary/10 border-primary/30 border'
                                : 'bg-background border-border border'
                            }`}
                          >
                            <span
                              className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                              {slot.split(' (')[0]}
                              <span className="mt-0.5 block text-xs font-medium opacity-70">
                                {slot.split('(')[1].replace(')', '')}
                              </span>
                            </span>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted border-border border'
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed right-4 bottom-20 left-4 z-40"
      >
        <button className="bg-primary text-primary-foreground shadow-primary/30 w-full rounded-2xl py-4 text-lg font-bold shadow-xl transition-transform active:scale-[0.98]">
          Save Schedule
        </button>
      </motion.div>
    </div>
  );
}
