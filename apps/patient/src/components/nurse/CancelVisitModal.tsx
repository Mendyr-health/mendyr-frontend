"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { useModalHistory } from "@mendyr/shared-utils";

const CANCEL_REASONS = [
  "Patient requested cancellation",
  "Vehicle or transport issue",
  "Personal emergency",
  "Distance is too far",
];

interface CancelVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelVisitModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelVisitModalProps) {
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState("");

  useModalHistory(isOpen, onClose, "cancel-visit-modal");

  const handleClose = () => {
    setShowOtherReason(false);
    setOtherReasonText("");
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
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-background rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold font-outfit text-foreground">
              Cancel Visit
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            Please select a reason for cancelling this visit. Warning: Excessive
            cancellations may affect your acceptance rate.
          </p>

          <div className="space-y-3 mb-6">
            {!showOtherReason ? (
              <>
                {CANCEL_REASONS.map((reason, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-4 rounded-xl border border-border hover:border-rose-300 hover:bg-rose-50 text-foreground hover:text-rose-700 transition-colors font-medium text-sm"
                    onClick={() => handleConfirmReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
                <button
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-rose-300 hover:bg-rose-50 text-foreground hover:text-rose-700 transition-colors font-medium text-sm"
                  onClick={() => setShowOtherReason(true)}
                >
                  Other...
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <textarea
                  placeholder="Please specify the reason..."
                  className="w-full p-4 rounded-xl border border-border bg-muted/50 focus:border-primary outline-none min-h-[100px] text-sm text-foreground"
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-12"
                    onClick={() => setShowOtherReason(false)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 shadow-md shadow-rose-500/20"
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
            className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground"
            onClick={handleClose}
          >
            Keep Visit
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
