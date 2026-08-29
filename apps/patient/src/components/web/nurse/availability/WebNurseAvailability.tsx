'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border overflow-x-auto rounded-2xl border p-6"
      >
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-muted-foreground pr-4 pb-4 text-left text-xs">Slot</th>
              {DAYS.map((day) => (
                <th key={day} className="text-muted-foreground px-2 pb-4 text-center text-xs">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot}>
                <td className="text-muted-foreground py-2 pr-4 text-sm whitespace-nowrap">
                  {slot}
                </td>
                {DAYS.map((day) => (
                  <td key={day} className="px-2 py-2 text-center">
                    <button
                      onClick={() => toggle(day, slotIdx)}
                      className={cn(
                        'h-9 w-full cursor-pointer rounded-lg transition-all duration-200',
                        schedule[day][slotIdx]
                          ? 'bg-primary/20 border-primary shadow-primary/10 border shadow-sm'
                          : 'bg-muted border-border hover:bg-muted/80 border',
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <Button>Save Availability</Button>
    </div>
  );
}
