'use client';

import { motion } from 'framer-motion';
import { timelineSteps, statusMap } from '@/components/web/nurse/status/WebNurseStatus';

export default function MobileNurseStatus() {
  return (
    <div className="space-y-4 pb-24">
      <div className="mb-6 px-2">
        <h1 className="text-foreground text-2xl font-bold">Status</h1>
        <p className="text-muted-foreground mt-1 text-sm">Application progress</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-2">
        <div className="bg-card border-border relative rounded-3xl border p-6 shadow-sm">
          <div className="bg-muted absolute top-10 bottom-10 left-11 w-0.5" />

          <div className="space-y-6">
            {timelineSteps.map((step, idx) => {
              const config = statusMap[step.status];
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="relative flex gap-4"
                >
                  <div
                    className={`border-card relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : isCurrent
                          ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {config.icon}
                  </div>

                  <div className="flex-1 pt-1">
                    <h3
                      className={`text-sm font-bold ${
                        isCompleted
                          ? 'text-foreground'
                          : isCurrent
                            ? 'text-amber-500'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {step.description}
                    </p>
                    <span className="text-muted-foreground/70 bg-muted/50 mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
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
