"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Check,
} from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { useModalHistory } from "@mendyr/shared-utils";
import type { AppointmentPublic } from "@/types";

interface RequestDetailModalProps {
  appointment: AppointmentPublic | null;
  onClose: () => void;
  onAccept: (publicId: string) => void;
  onDecline: (publicId: string) => void;
}

export default function RequestDetailModal({
  appointment,
  onClose,
  onAccept,
  onDecline,
}: RequestDetailModalProps) {
  useModalHistory(!!appointment, onClose, "request-detail-modal");

  if (!appointment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-background rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:bg-white/20 hover:text-white rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl font-bold border-2 border-white/40 shadow-inner">
                {appointment.patientName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-outfit">
                  {appointment.serviceName}
                </h2>
                <p className="text-white/80 font-medium text-sm sm:text-base">
                  {appointment.patientName}
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-md">
              <div>
                <p className="text-white/70 text-sm font-medium">Est. Payout</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{appointment.payoutAmount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm font-medium">Distance</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {appointment.location.distanceKm} km
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Time & Location
              </h3>
              <div className="bg-muted rounded-xl p-4 space-y-3 text-sm border border-border/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Date & Time
                  </span>
                  <span className="font-semibold">
                    {appointment.date} • {appointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Address
                  </span>
                  <span className="font-semibold text-right max-w-[200px]">
                    {appointment.location.address}, {appointment.location.city}
                  </span>
                </div>
              </div>
            </div>

            {appointment.specialInstructions && (
              <div>
                <h3 className="font-bold text-base mb-2">Special Instructions</h3>
                <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground border border-border/50">
                  {appointment.specialInstructions}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-border bg-muted/30 flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl"
              onClick={() => {
                onDecline(appointment.publicId);
                onClose();
              }}
            >
              Decline
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl"
              onClick={() => {
                onAccept(appointment.publicId);
                onClose();
              }}
            >
              <Check className="w-5 h-5 mr-1" /> Accept
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
