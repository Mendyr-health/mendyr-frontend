"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { useAvailability } from "@/features/nurse/useAvailability";

const dayFullNames: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"
};

export default function MobileNurseAvailability() {
  const { schedule, toggle, DAYS, SLOTS } = useAvailability();
  const [expandedDay, setExpandedDay] = useState<string>("Mon");

  return (
    <div className="pb-28 space-y-4">
      {/* Header */}
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Availability</h1>
        <p className="text-sm text-muted-foreground mt-1">Set your working hours</p>
      </div>

      {/* Days Accordion List */}
      <div className="px-2 flex flex-col gap-3">
        {DAYS.map((day, idx) => {
          const isExpanded = expandedDay === day;
          const selectedCount = schedule[day].filter(Boolean).length;
          
          return (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-card border rounded-3xl overflow-hidden shadow-sm transition-colors ${
                isExpanded ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer active:bg-muted/50 transition-colors"
                onClick={() => setExpandedDay(isExpanded ? "" : day)}
              >
                <div>
                  <h3 className="font-bold text-foreground text-base">{dayFullNames[day]}</h3>
                  <p className={`text-xs font-medium mt-0.5 ${selectedCount > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {selectedCount > 0 ? `${selectedCount} slots selected` : "No slots selected"}
                  </p>
                </div>
                <div className={`p-2 rounded-full transition-transform ${isExpanded ? "bg-primary/10 text-primary rotate-180" : "bg-muted text-muted-foreground"}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50 bg-muted/10"
                  >
                    <div className="p-3 grid grid-cols-1 gap-2">
                      {SLOTS.map((slot, slotIdx) => {
                        const isSelected = schedule[day][slotIdx];
                        return (
                          <div 
                            key={slotIdx}
                            onClick={() => toggle(day, slotIdx)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                              isSelected 
                                ? "bg-primary/10 border border-primary/30" 
                                : "bg-background border border-border"
                            }`}
                          >
                            <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                              {slot.split(" (")[0]}
                              <span className="block text-xs font-medium opacity-70 mt-0.5">
                                {slot.split("(")[1].replace(")", "")}
                              </span>
                            </span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
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
        className="fixed bottom-20 left-4 right-4 z-40"
      >
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform text-lg">
          Save Schedule
        </button>
      </motion.div>
    </div>
  );
}
