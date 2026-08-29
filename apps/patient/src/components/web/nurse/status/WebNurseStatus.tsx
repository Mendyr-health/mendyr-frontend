"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

export const timelineSteps = [
  { label: "Application Submitted", description: "Your application was received.", status: "completed", date: "Dec 2025" },
  { label: "Documents Uploaded", description: "Your documents have been submitted for review.", status: "completed", date: "Dec 2025" },
  { label: "Under Review", description: "An admin is reviewing your credentials.", status: "current", date: "In progress" },
  { label: "Verification Complete", description: "Your profile will be verified and approved.", status: "upcoming", date: "Pending" },
];

export const statusMap: Record<string, { icon: React.ReactNode; dotColor: string }> = {
  completed: { icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, dotColor: "bg-emerald-500" },
  current: { icon: <AlertCircle className="h-5 w-5 text-amber-500 animate-pulse" />, dotColor: "bg-amber-500" },
  upcoming: { icon: <Clock className="h-5 w-5 text-muted-foreground" />, dotColor: "bg-muted-foreground" },
  rejected: { icon: <XCircle className="h-5 w-5 text-red-500" />, dotColor: "bg-red-500" },
};

export default function WebNurseStatus() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-outfit">Verification Status</h1>
        <p className="text-muted-foreground mt-1">Track the progress of your application.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border max-w-2xl"
      >
        <div className="relative">
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-muted" />
          <div className="space-y-8">
            {timelineSteps.map((step, idx) => {
              const config = statusMap[step.status];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 h-10 w-10 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center">
                    {config.icon}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${step.status === "upcoming" ? "text-muted-foreground/70" : "text-foreground"}`}>
                        {step.label}
                      </h3>
                      <span className="text-xs text-muted-foreground/70">{step.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
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
