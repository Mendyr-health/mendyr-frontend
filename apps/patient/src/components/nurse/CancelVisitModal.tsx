'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { useModalHistory } from '@mendyr/shared-utils';

const CANCEL_REASONS = [
  'Patient requested cancellation',
  'Vehicle or transport issue',
  'Personal emergency',
  'Distance is too far',
];

interface CancelVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelVisitModal({ isOpen, onClose, onConfirm }: CancelVisitModalProps) {
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');

  useModalHistory(isOpen, onClose, 'cancel-visit-modal');

  const handleClose = () => {
    setShowOtherReason(false);
    setOtherReasonText('');
    onClose();
  };

  const handleConfirmReason = (reason: string) => {
    onConfirm(reason);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-outfit text-foreground text-xl font-bold sm:text-2xl">
              Cancel Visit
            </h3>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            Please select a reason for cancelling this visit. Warning: Excessive cancellations may
            affect your acceptance rate.
          </p>

          <div className="mb-6 space-y-3">
            {!showOtherReason ? (
              <>
                {CANCEL_REASONS.map((reason, i) => (
                  <button
                    key={i}
                    className="border-border text-foreground w-full rounded-xl border p-4 text-left text-sm font-medium transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => handleConfirmReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
                <button
                  className="border-border text-foreground w-full rounded-xl border p-4 text-left text-sm font-medium transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setShowOtherReason(true)}
                >
                  Other...
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <textarea
                  placeholder="Please specify the reason..."
                  className="border-border bg-muted/50 focus:border-primary text-foreground min-h-[100px] w-full rounded-xl border p-4 text-sm outline-none"
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-xl"
                    onClick={() => setShowOtherReason(false)}
                  >
                    Back
                  </Button>
                  <Button
                    className="h-12 flex-1 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:bg-rose-700"
                    onClick={() => {
                      if (otherReasonText.trim()) {
                        handleConfirmReason(otherReasonText.trim());
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-12 w-full rounded-xl"
            onClick={handleClose}
          >
            Keep Visit
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
