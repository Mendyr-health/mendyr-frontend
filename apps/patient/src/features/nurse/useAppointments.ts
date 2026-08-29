'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  acceptAppointmentRequest,
  rejectAppointmentRequest,
  startCareVisit,
  completeCareVisit,
  selectNurseAppointments,
  selectNurseEarningsSummary,
} from '@/store/slices/nurseSlice';
import { AppointmentPublic, CareNotePublic } from '@/types';
import { toast } from 'sonner';

export function useAppointments() {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector(selectNurseAppointments);
  const earningsSummary = useAppSelector(selectNurseEarningsSummary);

  const pendingRequests = appointments.filter((apt) => apt.status === 'REQUESTED');
  const acceptedVisits = appointments.filter((apt) => apt.status === 'CONFIRMED');
  const inProgressVisits = appointments.filter((apt) => apt.status === 'IN_PROGRESS');
  const completedVisits = appointments.filter((apt) => apt.status === 'COMPLETED');
  const rejectedRequests = appointments.filter(
    (apt) => apt.status === 'REJECTED' || apt.status === 'CANCELLED',
  );

  const acceptAppointment = (publicId: string) => {
    dispatch(acceptAppointmentRequest(publicId));
    toast.success('Shift Accepted!', {
      description: 'You have confirmed the appointment. It has been added to your schedule.',
    });
  };

  const rejectAppointment = (publicId: string, reason: string = 'Schedule conflict') => {
    dispatch(rejectAppointmentRequest({ id: publicId, reason }));
    toast.error('Appointment Declined', {
      description: `Reason: ${reason}`,
    });
  };

  const startVisit = (publicId: string) => {
    dispatch(startCareVisit(publicId));
    toast.info('Visit Started', {
      description:
        "You are now checked in. Don't forget to log clinical notes & vitals before checkout.",
    });
  };

  const completeVisit = (
    publicId: string,
    notesOrNote: string | CareNotePublic,
    vitals?: any,
    meds?: string[],
  ) => {
    const noteObj: CareNotePublic =
      typeof notesOrNote === 'string'
        ? {
            id: `note-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            notes: notesOrNote,
            authorName: 'Nurse Keshav',
            vitals,
            medicationsAdministered: meds,
          }
        : notesOrNote;
    dispatch(completeCareVisit({ id: publicId, note: noteObj }));
    toast.success('Visit Completed & Payout Unlocked! 🎉', {
      description: 'Clinical summary submitted. Your earnings have been credited to your balance.',
    });
  };

  const cancelVisit = (publicId: string, reason: string = "Nurse cancelled") => {
    dispatch(rejectAppointmentRequest({ id: publicId, reason }));
    toast.error("Visit Cancelled", {
      description: `Reason: ${reason}. The appointment has been removed from your schedule.`,
    });
  };

  const getEarningsSummary = () => earningsSummary;

  return {
    appointments,
    pendingRequests,
    acceptedVisits,
    inProgressVisits,
    completedVisits,
    rejectedRequests,
    acceptAppointment,
    rejectAppointment,
    cancelVisit,
    startVisit,
    completeVisit,
    getEarningsSummary,
  };
}
