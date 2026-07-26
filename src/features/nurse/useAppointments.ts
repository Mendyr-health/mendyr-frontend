"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { AppointmentPublic, AppointmentStatus, CareNotePublic, NurseEarningsSummary } from "@/types";

const INITIAL_APPOINTMENTS: AppointmentPublic[] = [
  {
    publicId: "apt-101",
    patientName: "Aarav Sharma",
    patientAge: 68,
    patientGender: "Male",
    patientPhone: "+91 98765 43210",
    serviceName: "Post-Operative Care",
    serviceSlug: "post-operative-care",
    date: "Today, 26 Jul",
    timeSlot: "10:00 AM - 02:00 PM",
    durationHours: 4,
    location: {
      address: "402, Lotus Towers, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      distanceKm: 2.4,
    },
    payoutAmount: 1600,
    status: "PENDING_ACCEPTANCE",
    specialInstructions: "Patient underwent knee replacement 4 days ago. Needs dressing change, pain monitoring, and assistance with light physiotherapy exercises.",
    medicalConditions: ["Hypertension", "Post-TKR Surgery"],
    createdAt: "2026-07-26T08:30:00Z",
  },
  {
    publicId: "apt-102",
    patientName: "Priya Patel",
    patientAge: 42,
    patientGender: "Female",
    patientPhone: "+91 98111 22334",
    serviceName: "IV Therapy & Injections",
    serviceSlug: "home-nursing",
    date: "Today, 26 Jul",
    timeSlot: "04:00 PM - 05:30 PM",
    durationHours: 1.5,
    location: {
      address: "15-B, Green Meadows, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      distanceKm: 5.1,
    },
    payoutAmount: 850,
    status: "PENDING_ACCEPTANCE",
    specialInstructions: "Requires IV iron infusion and vital signs monitoring. Cannula is already placed.",
    medicalConditions: ["Severe Anemia"],
    createdAt: "2026-07-26T09:15:00Z",
  },
  {
    publicId: "apt-103",
    patientName: "Meera Joshi",
    patientAge: 75,
    patientGender: "Female",
    patientPhone: "+91 99887 76655",
    serviceName: "Elder Care Support",
    serviceSlug: "elder-care-support",
    date: "Tomorrow, 27 Jul",
    timeSlot: "09:00 AM - 05:00 PM",
    durationHours: 8,
    location: {
      address: "12, Shanti Niketan, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      distanceKm: 3.8,
    },
    payoutAmount: 2200,
    status: "ACCEPTED",
    specialInstructions: "Assistance with daily living activities, blood sugar monitoring before lunch, and evening walking support.",
    medicalConditions: ["Type 2 Diabetes", "Mild Arthritis"],
    createdAt: "2026-07-25T14:20:00Z",
  },
  {
    publicId: "apt-104",
    patientName: "Vikram Singh",
    patientAge: 55,
    patientGender: "Male",
    patientPhone: "+91 97654 32109",
    serviceName: "Home Nursing & Vitals",
    serviceSlug: "home-nursing",
    date: "Yesterday, 25 Jul",
    timeSlot: "11:00 AM - 01:00 PM",
    durationHours: 2,
    location: {
      address: "88, Palm Grove, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      distanceKm: 7.2,
    },
    payoutAmount: 1100,
    status: "COMPLETED",
    specialInstructions: "Routine vital check and surgical wound dressing.",
    medicalConditions: ["Post-Appendectomy"],
    checkInTime: "11:02 AM",
    checkOutTime: "01:05 PM",
    careNotes: [
      {
        id: "note-1",
        timestamp: "25 Jul, 12:30 PM",
        vitals: {
          bloodPressure: "120/80 mmHg",
          heartRate: "74 bpm",
          temperature: "98.4 °F",
          oxygenSaturation: "98%",
        },
        medicationsAdministered: ["Paracetamol 500mg", "Amoxicillin 500mg"],
        notes: "Wound site clean, no signs of infection or redness. Patient comfortable after dressing change.",
        authorName: "Nurse",
      },
    ],
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    publicId: "apt-105",
    patientName: "Siddharth Verma",
    patientAge: 60,
    patientGender: "Male",
    patientPhone: "+91 91234 56789",
    serviceName: "Physiotherapy Support",
    serviceSlug: "physiotherapy",
    date: "24 Jul",
    timeSlot: "03:00 PM - 04:30 PM",
    durationHours: 1.5,
    location: {
      address: "204, Sea View Apts, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      distanceKm: 8.5,
    },
    payoutAmount: 950,
    status: "COMPLETED",
    specialInstructions: "Assistance with post-stroke shoulder rehabilitation exercises.",
    checkInTime: "03:00 PM",
    checkOutTime: "04:30 PM",
    createdAt: "2026-07-23T16:00:00Z",
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentPublic[]>(INITIAL_APPOINTMENTS);

  // Load from localStorage if available in browser
  useEffect(() => {
    const saved = localStorage.getItem("mendyr_nurse_appointments");
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch {
        // Fallback to initial
      }
    }
  }, []);

  const saveToStorage = (updated: AppointmentPublic[]) => {
    setAppointments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("mendyr_nurse_appointments", JSON.stringify(updated));
    }
  };

  const acceptAppointment = (id: string) => {
    const updated = appointments.map((apt) =>
      apt.publicId === id ? { ...apt, status: "ACCEPTED" as AppointmentStatus } : apt
    );
    saveToStorage(updated);
    const target = appointments.find((a) => a.publicId === id);
    toast.success(`Appointment Accepted!`, {
      description: `You are scheduled to care for ${target?.patientName} on ${target?.date} (${target?.timeSlot}).`,
    });
  };

  const rejectAppointment = (id: string, reason: string) => {
    const updated = appointments.map((apt) =>
      apt.publicId === id
        ? { ...apt, status: "REJECTED" as AppointmentStatus, rejectionReason: reason }
        : apt
    );
    saveToStorage(updated);
    const target = appointments.find((a) => a.publicId === id);
    toast.error(`Appointment Declined`, {
      description: `Request for ${target?.patientName} declined. Reason: ${reason || "Not specified"}`,
    });
  };

  const startVisit = (id: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = appointments.map((apt) =>
      apt.publicId === id
        ? { ...apt, status: "IN_PROGRESS" as AppointmentStatus, checkInTime: nowStr }
        : apt
    );
    saveToStorage(updated);
    toast.info("Visit Started & Checked In", {
      description: `Care session initiated at ${nowStr}. You can now log patient vitals and care notes.`,
    });
  };

  const completeVisit = (
    id: string,
    notes: string,
    vitals?: { bloodPressure?: string; heartRate?: string; temperature?: string; oxygenSaturation?: string },
    meds?: string[]
  ) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newNote: CareNotePublic = {
      id: `note-${Date.now()}`,
      timestamp: `Today, ${nowStr}`,
      vitals,
      medicationsAdministered: meds || [],
      notes,
      authorName: "Nurse",
    };

    const updated = appointments.map((apt) =>
      apt.publicId === id
        ? {
            ...apt,
            status: "COMPLETED" as AppointmentStatus,
            checkOutTime: nowStr,
            careNotes: [...(apt.careNotes || []), newNote],
          }
        : apt
    );
    saveToStorage(updated);
    const target = appointments.find((a) => a.publicId === id);
    toast.success("Visit Completed Successfully!", {
      description: `Payment of ₹${target?.payoutAmount} added to your earnings balance.`,
    });
  };

  const getEarningsSummary = (): NurseEarningsSummary => {
    const completed = appointments.filter((a) => a.status === "COMPLETED");
    const total = completed.reduce((sum, a) => sum + a.payoutAmount, 0);
    const today = completed
      .filter((a) => a.date.includes("Today") || a.date.includes("26 Jul"))
      .reduce((sum, a) => sum + a.payoutAmount, 0);
    const pending = appointments
      .filter((a) => a.status === "ACCEPTED" || a.status === "IN_PROGRESS")
      .reduce((sum, a) => sum + a.payoutAmount, 0);

    return {
      todayEarnings: today,
      weekEarnings: total,
      monthEarnings: total + 14500, // mock monthly baseline
      totalEarnings: total + 32000,
      pendingPayout: pending,
      completedVisitsCount: completed.length + 18,
      transactions: completed.map((a) => ({
        id: `tx-${a.publicId}`,
        appointmentId: a.publicId,
        patientName: a.patientName,
        serviceName: a.serviceName,
        date: a.date,
        amount: a.payoutAmount,
        status: "PAID",
        paymentMethod: "Direct Bank Deposit",
      })),
    };
  };

  return {
    appointments,
    pendingRequests: appointments.filter((a) => a.status === "PENDING_ACCEPTANCE"),
    acceptedVisits: appointments.filter((a) => a.status === "ACCEPTED"),
    inProgressVisits: appointments.filter((a) => a.status === "IN_PROGRESS"),
    completedVisits: appointments.filter((a) => a.status === "COMPLETED"),
    rejectedRequests: appointments.filter((a) => a.status === "REJECTED"),
    acceptAppointment,
    rejectAppointment,
    startVisit,
    completeVisit,
    getEarningsSummary,
  };
}
