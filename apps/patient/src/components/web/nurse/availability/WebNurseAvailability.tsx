"use client";

import { motion } from "framer-motion";
import { Calendar, Check } from "lucide-react";
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

      {/* Desktop View: Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden md:block bg-glass rounded-2xl p-6 md:p-8 border border-border overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-6 pr-4 w-1/4">Time Slot</th>
              {DAYS.map((day) => (
                <th key={day} className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-6 px-2 w-[10%]">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot} className="border-t border-border/40">
                <td className="text-sm font-semibold text-foreground py-4 pr-4">{slot}</td>
                {DAYS.map((day) => (
                  <td key={day} className="text-center py-3 px-2">
                    <button
                      onClick={() => toggle(day, slotIdx)}
                      className={cn(
                        "h-10 w-full rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center",
                        schedule[day][slotIdx]
                          ? "bg-primary/10 border-2 border-primary shadow-sm shadow-primary/10 text-primary"
                          : "bg-muted border-2 border-transparent hover:border-primary/30"
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
      <div className="md:hidden space-y-4">
        {DAYS.map((day, idx) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-glass rounded-2xl p-5 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">{day}</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                {schedule[day].filter(Boolean).length} / 4 slots
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SLOTS.map((slot, slotIdx) => {
                const isActive = schedule[day][slotIdx];
                const shortName = slot.split(" ")[0]; 
                return (
                  <button
                    key={slot}
                    onClick={() => toggle(day, slotIdx)}
                    className={cn(
                      "py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-muted border-2 border-transparent text-muted-foreground hover:bg-muted/80"
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

      <div className="pt-4 border-t border-border flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto">
          Save Availability
        </Button>
      </div>
    </div>
  );
}
