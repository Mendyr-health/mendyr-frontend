"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppointments } from "@/features/nurse/useAppointments";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentPublic } from "@/types";

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

  const [activeTab, setActiveTab] = useState<"pending" | "upcoming" | "active" | "completed">("pending");

  // Rejection modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Schedule conflict");
  const [customReason, setCustomReason] = useState("");

  // Complete visit modal state
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [bp, setBp] = useState("120/80 mmHg");
  const [hr, setHr] = useState("72 bpm");
  const [temp, setTemp] = useState("98.6 °F");
  const [spo2, setSpo2] = useState("98%");
  const [meds, setMeds] = useState("Routine oral medication");
  const [careNotes, setCareNotes] = useState("Patient is stable, vital signs normal. Wound dressing changed with sterile technique.");

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    const reason = rejectReason === "Other" ? customReason : rejectReason;
    rejectAppointment(rejectingId, reason);
    setRejectingId(null);
    setCustomReason("");
  };

  const handleConfirmComplete = () => {
    if (!completingId) return;
    completeVisit(
      completingId,
      careNotes,
      { bloodPressure: bp, heartRate: hr, temperature: temp, oxygenSaturation: spo2 },
      meds ? [meds] : []
    );
    setCompletingId(null);
  };

  const getTabList = () => {
    switch (activeTab) {
      case "pending":
        return pendingRequests;
      case "upcoming":
        return acceptedVisits;
      case "active":
        return inProgressVisits;
      case "completed":
        return completedVisits;
      default:
        return [];
    }
  };

  const currentList = getTabList();

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-outfit flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            Patient Appointments & Clinical Care
          </h1>
          <p className="text-muted-foreground mt-1">Review incoming booking requests, manage your active care shifts, and log clinical notes.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
          <Sparkles className="h-4 w-4" />
          <span>Instant Payout Enabled</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {[
          { id: "pending", label: "Pending Requests", count: pendingRequests.length, color: "bg-amber-500 text-white" },
          { id: "upcoming", label: "Scheduled & Upcoming", count: acceptedVisits.length, color: "bg-blue-500 text-white" },
          { id: "active", label: "Active Visits (In Progress)", count: inProgressVisits.length, color: "bg-emerald-500 text-white animate-pulse" },
          { id: "completed", label: "Completed History", count: completedVisits.length, color: "bg-muted text-muted-foreground" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                : "bg-glass border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : tab.color}`}>
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
              className="bg-glass rounded-2xl p-12 text-center border border-border/50 max-w-xl mx-auto my-8"
            >
              <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No appointments in this view</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "pending" && "You have no new patient requests at the moment. We'll notify you when new bookings arrive near your location."}
                {activeTab === "upcoming" && "You haven't accepted any upcoming visits yet. Check 'Pending Requests' to accept new shifts."}
                {activeTab === "active" && "No care visits are currently in progress. Start an accepted visit when you arrive at the patient's location."}
                {activeTab === "completed" && "You haven't completed any care visits yet."}
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
                className={`bg-glass rounded-2xl p-6 md:p-8 border transition-all ${
                  apt.status === "IN_PROGRESS"
                    ? "border-emerald-500/50 shadow-xl shadow-emerald-500/5 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent"
                    : apt.status === "PENDING_ACCEPTANCE"
                    ? "border-amber-500/30 hover:border-amber-500/50"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left: Patient Info & Service */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                        {apt.patientName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-foreground">{apt.patientName}</h3>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium text-muted-foreground">
                            {apt.patientAge} yrs • {apt.patientGender}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                            {apt.serviceName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          <strong className="text-foreground">{apt.date}</strong> ({apt.timeSlot}) • {apt.durationHours} hrs
                        </p>
                      </div>
                    </div>

                    {/* Location & Distance */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/40">
                      <MapPin className="h-4 w-4 text-red-400 shrink-0" />
                      <span className="text-foreground font-medium">{apt.location.address}, {apt.location.city}</span>
                      {apt.location.distanceKm && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-white/5 text-primary-light font-bold">
                          {apt.location.distanceKm} km away
                        </span>
                      )}
                    </div>

                    {/* Medical Conditions & Instructions */}
                    {apt.medicalConditions && apt.medicalConditions.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-medium">Conditions:</span>
                        {apt.medicalConditions.map((cond) => (
                          <span key={cond} className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                            {cond}
                          </span>
                        ))}
                      </div>
                    )}

                    {apt.specialInstructions && (
                      <div className="text-sm text-muted-foreground bg-glass p-3.5 rounded-xl border border-border/60 flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground font-medium">Patient Note & Care Instructions:</strong>
                          <p className="mt-0.5 text-xs md:text-sm leading-relaxed">{apt.specialInstructions}</p>
                        </div>
                      </div>
                    )}

                    {/* Care Notes History if Completed */}
                    {apt.careNotes && apt.careNotes.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" /> Logged Clinical Visit Report ({apt.checkInTime} - {apt.checkOutTime})
                        </h4>
                        {apt.careNotes.map((note) => (
                          <div key={note.id} className="text-xs text-muted-foreground space-y-1">
                            {note.vitals && (
                              <p className="text-foreground font-medium">
                                Vitals: BP {note.vitals.bloodPressure} | HR {note.vitals.heartRate} | Temp {note.vitals.temperature} | SpO2 {note.vitals.oxygenSaturation}
                              </p>
                            )}
                            <p className="italic">&ldquo;{note.notes}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Payout & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estimated Payout</span>
                      <div className="text-2xl font-black text-emerald-400 font-outfit flex items-center lg:justify-end">
                        ₹{apt.payoutAmount.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[11px] text-muted-foreground">Direct Bank Transfer</span>
                    </div>

                    {/* Buttons depending on status */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                      {apt.status === "PENDING_ACCEPTANCE" && (
                        <>
                          <Button
                            onClick={() => acceptAppointment(apt.publicId)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-1.5 px-5 flex-1 sm:flex-initial"
                          >
                            <Check className="h-4 w-4" /> Accept Shift
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setRejectingId(apt.publicId)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 flex-1 sm:flex-initial"
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        </>
                      )}

                      {apt.status === "ACCEPTED" && (
                        <>
                          <Button
                            onClick={() => startVisit(apt.publicId)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 px-6 shadow-lg shadow-primary/20"
                          >
                            <Play className="h-4 w-4 fill-current" /> Start Visit & Check In
                          </Button>
                          {apt.patientPhone && (
                            <a
                              href={`tel:${apt.patientPhone}`}
                              className="px-3 py-2 rounded-xl bg-glass border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                              title="Call Patient"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                        </>
                      )}

                      {apt.status === "IN_PROGRESS" && (
                        <Button
                          onClick={() => setCompletingId(apt.publicId)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 px-6 animate-pulse"
                        >
                          <Activity className="h-4 w-4" /> Log Vitals & Complete Visit
                        </Button>
                      )}

                      {apt.status === "COMPLETED" && (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                          <CheckCircle className="h-4 w-4" /> Visit Completed
                        </div>
                      )}

                      {apt.status === "REJECTED" && (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm">
                          <XCircle className="h-4 w-4" /> Declined ({apt.rejectionReason || "No reason"})
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-2xl p-6 border border-border max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" /> Decline Appointment Request
                </h3>
                <button onClick={() => setRejectingId(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Please let us know why you are unable to take this appointment. This helps us re-route the patient to another verified nurse immediately.
              </p>
              <div className="space-y-3">
                {["Schedule conflict", "Location too far from my zone", "Outside my clinical expertise", "Other"].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rejectReason === reason ? "border-primary bg-primary/10 text-foreground" : "border-border bg-glass text-muted-foreground hover:border-border/80"
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
                {rejectReason === "Other" && (
                  <Input
                    placeholder="Specify reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setRejectingId(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmReject} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border max-w-lg w-full shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-400" /> Log Clinical Report & Complete Visit
                </h3>
                <button onClick={() => setCompletingId(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Record the patient&apos;s vital signs and your care summary before completing this session. This report will be saved to the patient&apos;s digital health record.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Blood Pressure</label>
                  <Input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="e.g. 120/80 mmHg" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Heart Rate</label>
                  <Input value={hr} onChange={(e) => setHr(e.target.value)} placeholder="e.g. 72 bpm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Temperature</label>
                  <Input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="e.g. 98.6 °F" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">SpO2 (Oxygen)</label>
                  <Input value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="e.g. 98%" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Medications Administered / Procedures</label>
                <Input value={meds} onChange={(e) => setMeds(e.target.value)} placeholder="e.g. IV Saline 500ml, Dressing change" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Nurse Care Summary & Observations</label>
                <Textarea
                  rows={3}
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  placeholder="Summarize patient condition, response to care, and recommendations..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setCompletingId(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-1.5 px-6">
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
