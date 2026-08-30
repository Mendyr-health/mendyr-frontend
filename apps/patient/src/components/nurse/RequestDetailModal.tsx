'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Check } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { useModalHistory } from '@mendyr/shared-utils';
import type { AppointmentPublic } from '@/types';

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
  useModalHistory(!!appointment, onClose, 'request-detail-modal');

  if (!appointment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-background w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Header */}
          <div className="from-primary to-primary/80 relative bg-gradient-to-br p-6 text-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full text-white/70 hover:bg-white/20 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-xl font-bold shadow-inner sm:h-16 sm:w-16 sm:text-2xl">
                {appointment.patientName.charAt(0)}
              </div>
              <div>
                <h2 className="font-outfit text-xl font-bold sm:text-2xl">
                  {appointment.serviceName}
                </h2>
                <p className="text-sm font-medium text-white/80 sm:text-base">
                  {appointment.patientName}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-md">
              <div>
                <p className="text-sm font-medium text-white/70">Est. Payout</p>
                <p className="text-2xl font-bold sm:text-3xl">₹{appointment.payoutAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/70">Distance</p>
                <p className="text-xl font-bold sm:text-2xl">
                  {appointment.location.distanceKm} km
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="max-h-[50vh] space-y-6 overflow-y-auto p-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold sm:text-lg">
                <Clock className="text-primary h-5 w-5" /> Time & Location
              </h3>
              <div className="bg-muted border-border/50 space-y-3 rounded-xl border p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Date & Time</span>
                  <span className="font-semibold">
                    {appointment.date} • {appointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Address</span>
                  <span className="max-w-[200px] text-right font-semibold">
                    {appointment.location.address}, {appointment.location.city}
                  </span>
                </div>
              </div>
            </div>

            {appointment.specialInstructions && (
              <div>
                <h3 className="mb-2 text-base font-bold">Special Instructions</h3>
                <div className="bg-muted/50 text-muted-foreground border-border/50 rounded-xl border p-4 text-sm">
                  {appointment.specialInstructions}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-border bg-muted/30 flex gap-4 border-t p-6">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl border-rose-200 text-base font-bold text-rose-600 hover:bg-rose-50 sm:h-14 sm:text-lg"
              onClick={() => {
                onDecline(appointment.publicId);
                onClose();
              }}
            >
              Decline
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 shadow-primary/30 h-12 flex-1 rounded-xl text-base font-bold text-white shadow-lg sm:h-14 sm:text-lg"
              onClick={() => {
                onAccept(appointment.publicId);
                onClose();
              }}
            >
              <Check className="mr-1 h-5 w-5" /> Accept
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
