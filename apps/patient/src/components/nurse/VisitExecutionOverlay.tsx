"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Navigation,
  KeySquare,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { useModalHistory } from "@mendyr/shared-utils";

interface VisitInfo {
  publicId: string;
  patientName: string;
  serviceName: string;
  location: {
    address: string;
    city: string;
    distanceKm: number;
  };
}

interface VisitExecutionOverlayProps {
  visit: VisitInfo | null;
  onClose: () => void;
  onComplete: (publicId: string) => void;
}

export default function VisitExecutionOverlay({
  visit,
  onClose,
  onComplete,
}: VisitExecutionOverlayProps) {
  const [executionState, setExecutionState] = useState<
    "en_route" | "arrived" | "in_progress"
  >("en_route");
  const [otp, setOtp] = useState(["", "", "", ""]);

  useModalHistory(!!visit, onClose, "visit-execution-overlay");

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`exec-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const verifyOtp = () => {
    if (otp.join("") === "1234") {
      setExecutionState("in_progress");
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  const handleComplete = () => {
    if (visit) {
      onComplete(visit.publicId);
    }
    handleClose();
  };

  const handleClose = () => {
    setExecutionState("en_route");
    setOtp(["", "", "", ""]);
    onClose();
  };

  if (!visit) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col"
      >
        {/* Header */}
        <div className="bg-foreground text-background p-4 sm:p-6 pt-8 sm:pt-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-outfit">
              Active Visit
            </h2>
            <p className="text-muted/70 text-sm">
              {visit.patientName} • {visit.serviceName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-background hover:bg-white/20 rounded-full"
            onClick={handleClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="flex-1 bg-muted relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%239C92AC' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            {executionState === "en_route" && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white text-foreground px-4 sm:px-6 py-3 rounded-full font-bold shadow-xl border-2 border-primary text-base sm:text-xl flex items-center gap-2"
              >
                <Navigation className="w-5 h-5 text-primary" /> Heading to
                Destination
              </motion.div>
            )}
            {executionState === "arrived" && (
              <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-500/50">
                <MapPin className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sheet Controls */}
        <div className="bg-card shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-3xl -mt-6 relative z-10 p-6 sm:p-8 flex flex-col">
          {executionState === "en_route" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg mx-auto text-center space-y-4 sm:space-y-6"
            >
              <h3 className="text-xl sm:text-2xl font-bold font-outfit">
                En Route to {visit.patientName}
              </h3>
              <div className="flex items-center gap-4 bg-muted p-4 rounded-xl text-left">
                <MapPin className="w-6 sm:w-8 h-6 sm:h-8 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    {visit.location.address}, {visit.location.city}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Est. arrival in 12 mins ({visit.location.distanceKm} km)
                  </p>
                </div>
              </div>
              <Button
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30"
                onClick={() => setExecutionState("arrived")}
              >
                I have arrived
              </Button>
            </motion.div>
          )}

          {executionState === "arrived" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg mx-auto text-center space-y-4 sm:space-y-6"
            >
              <div className="w-14 sm:w-16 h-14 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <KeySquare className="w-7 sm:w-8 h-7 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-outfit">
                Verify Patient OTP
              </h3>
              <p className="text-muted-foreground text-sm">
                Please ask {visit.patientName} for their 4-digit Service OTP to
                begin care.
              </p>

              <div className="flex justify-center gap-3 sm:gap-4 my-6 sm:my-8">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`exec-otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 sm:w-16 h-16 sm:h-20 text-center text-2xl sm:text-3xl font-bold rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all bg-background"
                    placeholder="•"
                  />
                ))}
              </div>

              <Button
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30"
                onClick={verifyOtp}
              >
                Verify & Start Service
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                For demo, use PIN: 1234
              </p>
            </motion.div>
          )}

          {executionState === "in_progress" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  Service In Progress
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-outfit">
                  00:15:42
                </h3>
              </div>

              <div className="bg-muted rounded-xl p-4 sm:p-6 border border-border">
                <h4 className="font-bold text-base sm:text-lg mb-4">
                  Checklist & Notes
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-sm sm:text-base">
                      Verify Vitals
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-sm sm:text-base">
                      Administer Treatment
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-sm sm:text-base">
                      Update Electronic Health Record
                    </span>
                  </label>
                </div>
              </div>

              <Button
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
                onClick={handleComplete}
              >
                <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" /> Mark Service
                Complete
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
