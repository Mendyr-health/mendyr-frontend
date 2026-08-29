"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { cn } from "@mendyr/shared-utils";
import { useAvailability } from "@/features/nurse/useAvailability";

export default function WebNurseAvailability() {
  const { schedule, toggle, DAYS, SLOTS } = useAvailability();

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-outfit flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Availability
        </h1>
        <p className="text-muted-foreground mt-1">Set your weekly availability for shifts.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 border border-border overflow-x-auto"
      >
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left text-xs text-muted-foreground pb-4 pr-4">Slot</th>
              {DAYS.map((day) => (
                <th key={day} className="text-center text-xs text-muted-foreground pb-4 px-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot}>
                <td className="text-sm text-muted-foreground py-2 pr-4 whitespace-nowrap">{slot}</td>
                {DAYS.map((day) => (
                  <td key={day} className="text-center py-2 px-2">
                    <button
                      onClick={() => toggle(day, slotIdx)}
                      className={cn(
                        "h-9 w-full rounded-lg transition-all duration-200 cursor-pointer",
                        schedule[day][slotIdx]
                          ? "bg-primary/20 border border-primary shadow-sm shadow-primary/10"
                          : "bg-muted border border-border hover:bg-muted/80"
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
