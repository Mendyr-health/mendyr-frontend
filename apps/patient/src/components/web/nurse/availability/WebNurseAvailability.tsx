'use client';

import { motion } from 'framer-motion';
import { Calendar, Check } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { cn } from '@mendyr/shared-utils';
import { useAvailability } from '@/features/nurse/useAvailability';

export default function WebNurseAvailability() {
  const { schedule, toggle, DAYS, SLOTS } = useAvailability();

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground font-outfit flex items-center gap-2 text-2xl font-bold">
          <Calendar className="text-primary h-6 w-6" />
          Availability
        </h1>
        <p className="text-muted-foreground mt-1">Set your weekly availability for shifts.</p>
      </motion.div>

      {/* Desktop View: Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border hidden overflow-hidden rounded-2xl border p-6 md:block md:p-8"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-muted-foreground w-1/4 pr-4 pb-6 text-left text-xs font-semibold tracking-wider uppercase">
                Time Slot
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="text-muted-foreground w-[10%] px-2 pb-6 text-center text-xs font-semibold tracking-wider uppercase"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot} className="border-border/40 border-t">
                <td className="text-foreground py-4 pr-4 text-sm font-semibold">{slot}</td>
                {DAYS.map((day) => (
                  <td key={day} className="px-2 py-3 text-center">
                    <button
                      onClick={() => toggle(day, slotIdx)}
                      className={cn(
                        'flex h-10 w-full cursor-pointer items-center justify-center rounded-xl transition-all duration-200',
                        schedule[day][slotIdx]
                          ? 'bg-primary/10 border-primary shadow-primary/10 text-primary border-2 shadow-sm'
                          : 'bg-muted hover:border-primary/30 border-2 border-transparent',
                      )}
                    >
                      {schedule[day][slotIdx] && <Check className="h-4 w-4" />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile View: Vertical Card List */}
      <div className="space-y-4 md:hidden">
        {DAYS.map((day, idx) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-glass border-border rounded-2xl border p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground text-lg font-bold">{day}</h3>
              <span className="text-primary bg-primary/10 rounded-lg px-2.5 py-1 text-xs font-bold">
                {schedule[day].filter(Boolean).length} / 4 slots
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SLOTS.map((slot, slotIdx) => {
                const isActive = schedule[day][slotIdx];
                const shortName = slot.split(' ')[0];
                return (
                  <button
                    key={slot}
                    onClick={() => toggle(day, slotIdx)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 border-2 border-transparent',
                    )}
                  >
                    {isActive && <Check className="h-3.5 w-3.5" />} {shortName}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-border flex justify-end border-t pt-4">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-12 w-full rounded-xl px-8 font-bold shadow-lg sm:w-auto">
          Save Availability
        </Button>
      </div>
    </div>
  );
}
