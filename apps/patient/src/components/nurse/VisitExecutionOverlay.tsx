'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, KeySquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { useModalHistory } from '@mendyr/shared-utils';

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
  const [executionState, setExecutionState] = useState<'en_route' | 'arrived' | 'in_progress'>(
    'en_route',
  );
  const [otp, setOtp] = useState(['', '', '', '']);

  useModalHistory(!!visit, onClose, 'visit-execution-overlay');

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
    if (otp.join('') === '1234') {
      setExecutionState('in_progress');
    } else {
      alert('Invalid OTP. Try 1234');
    }
  };

  const handleComplete = () => {
    if (visit) {
      onComplete(visit.publicId);
    }
    handleClose();
  };

  const handleClose = () => {
    setExecutionState('en_route');
    setOtp(['', '', '', '']);
    onClose();
  };

  if (!visit) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-background fixed inset-0 z-[100] flex flex-col"
      >
        {/* Header */}
        <div className="bg-foreground text-background flex items-center justify-between p-4 pt-8 sm:p-6 sm:pt-10">
          <div>
            <h2 className="font-outfit text-xl font-bold sm:text-2xl">Active Visit</h2>
            <p className="text-muted/70 text-sm">
              {visit.patientName} • {visit.serviceName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-background rounded-full hover:bg-white/20"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="bg-muted relative flex-1">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%239C92AC' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {executionState === 'en_route' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-foreground border-primary flex items-center gap-2 rounded-full border-2 bg-white px-4 py-3 text-base font-bold shadow-xl sm:px-6 sm:text-xl"
              >
                <Navigation className="text-primary h-5 w-5" /> Heading to Destination
              </motion.div>
            )}
            {executionState === 'arrived' && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/50">
                <MapPin className="h-10 w-10" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sheet Controls */}
        <div className="bg-card relative z-10 -mt-6 flex flex-col rounded-t-3xl p-6 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] sm:p-8">
          {executionState === 'en_route' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto w-full max-w-lg space-y-4 text-center sm:space-y-6"
            >
              <h3 className="font-outfit text-xl font-bold sm:text-2xl">
                En Route to {visit.patientName}
              </h3>
              <div className="bg-muted flex items-center gap-4 rounded-xl p-4 text-left">
                <MapPin className="h-6 w-6 flex-shrink-0 text-rose-500 sm:h-8 sm:w-8" />
                <div>
                  <p className="text-sm font-semibold sm:text-base">
                    {visit.location.address}, {visit.location.city}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Est. arrival in 12 mins ({visit.location.distanceKm} km)
                  </p>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 shadow-primary/30 h-14 w-full rounded-2xl text-lg font-bold shadow-xl sm:h-16 sm:text-xl"
                onClick={() => setExecutionState('arrived')}
              >
                I have arrived
              </Button>
            </motion.div>
          )}

          {executionState === 'arrived' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto w-full max-w-lg space-y-4 text-center sm:space-y-6"
            >
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-16 sm:w-16">
                <KeySquare className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-outfit text-xl font-bold sm:text-2xl">Verify Patient OTP</h3>
              <p className="text-muted-foreground text-sm">
                Please ask {visit.patientName} for their 4-digit Service OTP to begin care.
              </p>

              <div className="my-6 flex justify-center gap-3 sm:my-8 sm:gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`exec-otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="border-border focus:border-primary focus:ring-primary/20 bg-background h-16 w-14 rounded-2xl border-2 text-center text-2xl font-bold transition-all outline-none focus:ring-4 sm:h-20 sm:w-16 sm:text-3xl"
                    placeholder="•"
                  />
                ))}
              </div>

              <Button
                className="bg-primary hover:bg-primary/90 shadow-primary/30 h-14 w-full rounded-2xl text-lg font-bold shadow-xl sm:h-16 sm:text-xl"
                onClick={verifyOtp}
              >
                Verify & Start Service
              </Button>
              <p className="text-muted-foreground mt-4 text-xs">For demo, use PIN: 1234</p>
            </motion.div>
          )}

          {executionState === 'in_progress' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto w-full max-w-lg space-y-4 sm:space-y-6"
            >
              <div className="mb-4 text-center sm:mb-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-bold text-emerald-700">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                  Service In Progress
                </div>
                <h3 className="font-outfit text-2xl font-bold sm:text-3xl">00:15:42</h3>
              </div>

              <div className="bg-muted border-border rounded-xl border p-4 sm:p-6">
                <h4 className="mb-4 text-base font-bold sm:text-lg">Checklist & Notes</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium sm:text-base">Verify Vitals</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium sm:text-base">Administer Treatment</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium sm:text-base">
                      Update Electronic Health Record
                    </span>
                  </label>
                </div>
              </div>

              <Button
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 sm:h-16 sm:text-xl"
                onClick={handleComplete}
              >
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> Mark Service Complete
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
