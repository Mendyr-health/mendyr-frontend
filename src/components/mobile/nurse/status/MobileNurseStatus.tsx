"use client";

import { motion } from "framer-motion";
import { timelineSteps, statusMap } from "@/components/web/nurse/status/WebNurseStatus";

export default function MobileNurseStatus() {
  return (
    <div className="pb-24 space-y-4">
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Status</h1>
        <p className="text-sm text-muted-foreground mt-1">Application progress</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2"
      >
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative">
          <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-muted" />
          
          <div className="space-y-6">
            {timelineSteps.map((step, idx) => {
              const config = statusMap[step.status];
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="relative flex gap-4"
                >
                  <div className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-4 border-card ${
                    isCompleted ? "bg-emerald-500/20 text-emerald-500" :
                    isCurrent ? "bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h3 className={`text-sm font-bold ${
                      isCompleted ? "text-foreground" :
                      isCurrent ? "text-amber-500" :
                      "text-muted-foreground"
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md">
                      {step.date}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
