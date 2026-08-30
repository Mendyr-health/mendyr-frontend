'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointments } from '@/features/nurse/useAppointments';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  FileText,
  Heart,
  Activity,
  Play,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Textarea } from '@mendyr/shared-ui/src/ui/textarea';
import { useModalHistory } from '@mendyr/shared-utils';
import type { AppointmentPublic } from '@/types';

export default function WebNurseAppointments() {
  const {
    appointments,
    pendingRequests,
    acceptedVisits,
    inProgressVisits,
    completedVisits,
    rejectedRequests,
    acceptAppointment,
    rejectAppointment,
    startVisit,
    completeVisit,
  } = useAppointments();

  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'active' | 'completed'>(
    'pending',
  );

  // Rejection modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Schedule conflict');
  const [customReason, setCustomReason] = useState('');

  // Complete visit modal state
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [bp, setBp] = useState('120/80 mmHg');
  const [hr, setHr] = useState('72 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [spo2, setSpo2] = useState('98%');
  const [meds, setMeds] = useState('Routine oral medication');
  const [careNotes, setCareNotes] = useState(
    'Patient is stable, vital signs normal. Wound dressing changed with sterile technique.',
  );

  useModalHistory(!!rejectingId, () => setRejectingId(null), 'reject-appointment-modal');
  useModalHistory(!!completingId, () => setCompletingId(null), 'complete-visit-modal');

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    const reason = rejectReason === 'Other' ? customReason : rejectReason;
    rejectAppointment(rejectingId, reason);
    setRejectingId(null);
    setCustomReason('');
  };

  const handleConfirmComplete = () => {
    if (!completingId) return;
    completeVisit(
      completingId,
      careNotes,
      { bloodPressure: bp, heartRate: hr, temperature: temp, oxygenSaturation: spo2 },
      meds ? [meds] : [],
    );
    setCompletingId(null);
  };

  const getTabList = () => {
    switch (activeTab) {
      case 'pending':
        return pendingRequests;
      case 'upcoming':
        return acceptedVisits;
      case 'active':
        return inProgressVisits;
      case 'completed':
        return completedVisits;
      default:
        return [];
    }
  };

  const currentList = getTabList();

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-foreground font-outfit flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <Stethoscope className="text-primary h-8 w-8" />
            Patient Appointments & Clinical Care
          </h1>
          <p className="text-muted-foreground mt-1">
            Review incoming booking requests, manage your active care shifts, and log clinical
            notes.
          </p>
        </div>
        <div className="bg-primary/10 border-primary/20 text-primary flex w-fit items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>Instant Payout Enabled</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-border flex flex-wrap gap-2 border-b pb-4">
        {[
          {
            id: 'pending',
            label: 'Pending Requests',
            count: pendingRequests.length,
            color: 'bg-amber-500 text-white',
          },
          {
            id: 'upcoming',
            label: 'Scheduled & Upcoming',
            count: acceptedVisits.length,
            color: 'bg-blue-500 text-white',
          },
          {
            id: 'active',
            label: 'Active Visits (In Progress)',
            count: inProgressVisits.length,
            color: 'bg-emerald-500 text-white animate-pulse',
          },
          {
            id: 'completed',
            label: 'Completed History',
            count: completedVisits.length,
            color: 'bg-muted text-muted-foreground',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-primary/25 scale-[1.02] shadow-lg'
                : 'bg-glass border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 border'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : tab.color}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {currentList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-glass border-border/50 mx-auto my-8 max-w-xl rounded-2xl border p-12 text-center"
            >
              <div className="bg-muted/40 text-muted-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-foreground text-lg font-semibold">
                No appointments in this view
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {activeTab === 'pending' &&
                  "You have no new patient requests at the moment. We'll notify you when new bookings arrive near your location."}
                {activeTab === 'upcoming' &&
                  "You haven't accepted any upcoming visits yet. Check 'Pending Requests' to accept new shifts."}
                {activeTab === 'active' &&
                  "No care visits are currently in progress. Start an accepted visit when you arrive at the patient's location."}
                {activeTab === 'completed' && "You haven't completed any care visits yet."}
              </p>
            </motion.div>
          ) : (
            currentList.map((apt) => (
              <motion.div
                key={apt.publicId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-glass rounded-2xl border p-6 transition-all md:p-8 ${
                  apt.status === 'IN_PROGRESS'
                    ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent shadow-xl shadow-emerald-500/5'
                    : apt.status === 'PENDING_ACCEPTANCE'
                      ? 'border-amber-500/30 hover:border-amber-500/50'
                      : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left: Patient Info & Service */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/15 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold">
                        {apt.patientName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-foreground text-lg font-bold">{apt.patientName}</h3>
                          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                            {apt.patientAge} yrs • {apt.patientGender}
                          </span>
                          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                            {apt.serviceName}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                          <Clock className="text-primary h-4 w-4" />
                          <strong className="text-foreground">{apt.date}</strong> ({apt.timeSlot}) •{' '}
                          {apt.durationHours} hrs
                        </p>
                      </div>
                    </div>

                    {/* Location & Distance */}
                    <div className="text-muted-foreground bg-muted/40 border-border/40 flex items-center gap-2 rounded-xl border p-3 text-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-foreground font-medium">
                        {apt.location.address}, {apt.location.city}
                      </span>
                      {apt.location.distanceKm && (
                        <span className="text-primary-light ml-auto rounded-md bg-white/5 px-2 py-0.5 text-xs font-bold">
                          {apt.location.distanceKm} km away
                        </span>
                      )}
                    </div>

                    {/* Medical Conditions & Instructions */}
                    {apt.medicalConditions && apt.medicalConditions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground text-xs font-medium">
                          Conditions:
                        </span>
                        {apt.medicalConditions.map((cond) => (
                          <span
                            key={cond}
                            className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    )}

                    {apt.specialInstructions && (
                      <div className="text-muted-foreground bg-glass border-border/60 flex items-start gap-2.5 rounded-xl border p-3.5 text-sm">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        <div>
                          <strong className="text-foreground font-medium">
                            Patient Note & Care Instructions:
                          </strong>
                          <p className="mt-0.5 text-xs leading-relaxed md:text-sm">
                            {apt.specialInstructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Care Notes History if Completed */}
                    {apt.careNotes && apt.careNotes.length > 0 && (
                      <div className="mt-4 space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                          <CheckCircle className="h-4 w-4" /> Logged Clinical Visit Report (
                          {apt.checkInTime} - {apt.checkOutTime})
                        </h4>
                        {apt.careNotes.map((note) => (
                          <div key={note.id} className="text-muted-foreground space-y-1 text-xs">
                            {note.vitals && (
                              <p className="text-foreground font-medium">
                                Vitals: BP {note.vitals.bloodPressure} | HR {note.vitals.heartRate}{' '}
                                | Temp {note.vitals.temperature} | SpO2{' '}
                                {note.vitals.oxygenSaturation}
                              </p>
                            )}
                            <p className="italic">&ldquo;{note.notes}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Payout & Actions */}
                  <div className="border-border flex shrink-0 flex-col items-start justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:justify-start lg:border-t-0 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        Estimated Payout
                      </span>
                      <div className="font-outfit flex items-center text-2xl font-black text-emerald-400 lg:justify-end">
                        ₹{apt.payoutAmount.toLocaleString('en-IN')}
                      </div>
                      <span className="text-muted-foreground text-[11px]">
                        Direct Bank Transfer
                      </span>
                    </div>

                    {/* Buttons depending on status */}
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                      {apt.status === 'PENDING_ACCEPTANCE' && (
                        <>
                          <Button
                            onClick={() => acceptAppointment(apt.publicId)}
                            className="flex-1 gap-1.5 bg-emerald-500 px-5 font-semibold text-white hover:bg-emerald-600 sm:flex-initial"
                          >
                            <Check className="h-4 w-4" /> Accept Shift
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setRejectingId(apt.publicId)}
                            className="flex-1 border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 sm:flex-initial"
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        </>
                      )}

                      {apt.status === 'ACCEPTED' && (
                        <>
                          <Button
                            onClick={() => startVisit(apt.publicId)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 gap-1.5 px-6 font-semibold shadow-lg"
                          >
                            <Play className="h-4 w-4 fill-current" /> Start Visit & Check In
                          </Button>
                          {apt.patientPhone && (
                            <a
                              href={`tel:${apt.patientPhone}`}
                              className="bg-glass border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center rounded-xl border px-3 py-2"
                              title="Call Patient"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                        </>
                      )}

                      {apt.status === 'IN_PROGRESS' && (
                        <Button
                          onClick={() => setCompletingId(apt.publicId)}
                          className="animate-pulse gap-2 bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-600"
                        >
                          <Activity className="h-4 w-4" /> Log Vitals & Complete Visit
                        </Button>
                      )}

                      {apt.status === 'COMPLETED' && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                          <CheckCircle className="h-4 w-4" /> Visit Completed
                        </div>
                      )}

                      {apt.status === 'REJECTED' && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                          <XCircle className="h-4 w-4" /> Declined (
                          {apt.rejectionReason || 'No reason'})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Rejection Reason Modal Overlay */}
      <AnimatePresence>
        {rejectingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border-border w-full max-w-md space-y-5 rounded-2xl border p-6 shadow-2xl"
            >
              <div className="border-border flex items-center justify-between border-b pb-3">
                <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
                  <AlertCircle className="h-5 w-5 text-red-400" /> Decline Appointment Request
                </h3>
                <button
                  onClick={() => setRejectingId(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm">
                Please let us know why you are unable to take this appointment. This helps us
                re-route the patient to another verified nurse immediately.
              </p>
              <div className="space-y-3">
                {[
                  'Schedule conflict',
                  'Location too far from my zone',
                  'Outside my clinical expertise',
                  'Other',
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                      rejectReason === reason
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-glass text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                      className="accent-primary"
                    />
                    <span className="text-sm font-medium">{reason}</span>
                  </label>
                ))}
                {rejectReason === 'Other' && (
                  <Input
                    placeholder="Specify reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
              <div className="border-border mt-2 flex flex-col-reverse items-stretch justify-end gap-3 border-t pt-4 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  onClick={() => setRejectingId(null)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  className="w-full bg-red-500 font-semibold text-white hover:bg-red-600 sm:w-auto"
                >
                  Confirm Decline
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Complete Visit Modal Overlay */}
      <AnimatePresence>
        {completingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border-border my-8 w-full max-w-lg space-y-6 rounded-2xl border p-6 shadow-2xl md:p-8"
            >
              <div className="border-border flex items-center justify-between border-b pb-3">
                <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
                  <CheckCircle className="h-6 w-6 text-emerald-400" /> Log Clinical Report &
                  Complete Visit
                </h3>
                <button
                  onClick={() => setCompletingId(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm">
                Record the patient&apos;s vital signs and your care summary before completing this
                session. This report will be saved to the patient&apos;s digital health record.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                    Blood Pressure
                  </label>
                  <Input
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="e.g. 120/80 mmHg"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                    Heart Rate
                  </label>
                  <Input
                    value={hr}
                    onChange={(e) => setHr(e.target.value)}
                    placeholder="e.g. 72 bpm"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                    Temperature
                  </label>
                  <Input
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="e.g. 98.6 °F"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                    SpO2 (Oxygen)
                  </label>
                  <Input
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="e.g. 98%"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                  Medications Administered / Procedures
                </label>
                <Input
                  value={meds}
                  onChange={(e) => setMeds(e.target.value)}
                  placeholder="e.g. IV Saline 500ml, Dressing change"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                  Nurse Care Summary & Observations
                </label>
                <Textarea
                  rows={3}
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  placeholder="Summarize patient condition, response to care, and recommendations..."
                />
              </div>

              <div className="border-border mt-2 flex flex-col-reverse items-stretch justify-end gap-3 border-t pt-4 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  onClick={() => setCompletingId(null)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmComplete}
                  className="w-full gap-1.5 bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-600 sm:w-auto"
                >
                  <Check className="h-4 w-4" /> Submit Report & Claim Payout
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
