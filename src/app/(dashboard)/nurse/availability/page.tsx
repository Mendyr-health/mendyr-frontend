"use client";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)", "Night (12AM-6AM)"];

export default function NurseAvailabilityPage() {
  const [schedule, setSchedule] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {};
    DAYS.forEach((day) => { initial[day] = SLOTS.map(() => false); });
    return initial;
  });

  const toggle = (day: string, slotIdx: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((v, i) => (i === slotIdx ? !v : v)),
    }));
  };

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-100 font-outfit flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary-light" />
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
                          : "bg-muted border border-border hover:bg-muted"
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
