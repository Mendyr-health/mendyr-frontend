import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
  AppointmentPublic,
  AppointmentStatus,
  CareNotePublic,
  EarningTransactionPublic,
} from '@/types';

export interface NurseMessage {
  id: string;
  senderId: 'nurse' | 'patient';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: { type: 'image' | 'doc'; url: string; name: string };
}

export interface NurseMessageThread {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  serviceName: string;
  phone: string;
  online: boolean;
  unreadCount: number;
  lastActive: string;
  messages: NurseMessage[];
}

export interface NurseAvailability {
  days: { day: string; active: boolean; hours: string }[];
  shiftPreferences: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
  onDutyNow: boolean;
}

export interface NurseState {
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  appointments: AppointmentPublic[];
  transactions: EarningTransactionPublic[];
  messageThreads: NurseMessageThread[];
  availability: NurseAvailability;
  bankAccount: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
    holderName: string;
    verified: boolean;
  };
  loading: boolean;
}

const INITIAL_MOCK_APPOINTMENTS: AppointmentPublic[] = [
  {
    publicId: 'apt-101',
    patientName: 'Aarav Sharma',
    patientAge: 68,
    patientGender: 'Male',
    serviceName: 'Post-Operative Wound Care',
    status: 'REQUESTED',
    date: 'Today, 26 Jul',
    timeSlot: '10:00 AM - 11:30 AM',
    location: {
      address: '402, Palm Heights, Bandra West',
      city: 'Mumbai',
      distanceKm: 2.4,
    },
    payoutAmount: 1200,
    specialInstructions:
      'Patient had knee replacement 5 days ago. Needs sterile dressing change and vitals check.',
  },
  {
    publicId: 'apt-102',
    patientName: 'Priya Patel',
    patientAge: 42,
    patientGender: 'Female',
    serviceName: 'IV Therapy & Injection',
    status: 'REQUESTED',
    date: 'Today, 26 Jul',
    timeSlot: '02:00 PM - 03:00 PM',
    location: {
      address: '15, Lotus Towers, Andheri West',
      city: 'Mumbai',
      distanceKm: 4.1,
    },
    payoutAmount: 850,
    specialInstructions:
      'Administer IV iron infusion prescribed by Dr. Mehta. Check blood pressure before and after.',
  },
  {
    publicId: 'apt-103',
    patientName: 'Meera Joshi',
    patientAge: 75,
    patientGender: 'Female',
    serviceName: 'Elderly Daily Assistance',
    status: 'CONFIRMED',
    date: 'Tomorrow, 27 Jul',
    timeSlot: '09:00 AM - 12:00 PM',
    location: {
      address: '7B, Green Valley, Powai',
      city: 'Mumbai',
      distanceKm: 6.8,
    },
    payoutAmount: 1600,
    specialInstructions:
      'Morning hygiene assistance, insulin injection, and physical mobility exercises.',
  },
  {
    publicId: 'apt-104',
    patientName: 'Vikram Singh',
    patientAge: 55,
    patientGender: 'Male',
    serviceName: 'Post-Stroke Rehabilitation Care',
    status: 'COMPLETED',
    date: 'Yesterday, 25 Jul',
    timeSlot: '04:00 PM - 06:00 PM',
    location: {
      address: '88, Sea View Apts, Juhu',
      city: 'Mumbai',
      distanceKm: 3.2,
    },
    payoutAmount: 1800,
    checkInTime: '04:05 PM',
    checkOutTime: '06:00 PM',
    careNotes: [
      {
        id: 'note-1',
        timestamp: '06:00 PM',
        authorName: 'Nurse Keshav',
        notes:
          'Vitals stable: BP 128/82, HR 74 bpm. Completed limb mobility drills without discomfort.',
        vitals: { bloodPressure: '128/82', heartRate: 74, temperature: 98.4, oxygenLevel: 98 },
      },
    ],
  },
];

const INITIAL_MOCK_TRANSACTIONS: EarningTransactionPublic[] = [
  {
    id: 'TXN-98421',
    date: '25 Jul 2026',
    amount: 1800,
    status: 'PAID',
    serviceName: 'Post-Stroke Rehabilitation Care',
    patientName: 'Vikram Singh',
    paymentMethod: 'Direct Bank Deposit (NEFT)',
  },
  {
    id: 'TXN-98310',
    date: '24 Jul 2026',
    amount: 1450,
    status: 'PAID',
    serviceName: 'Chemotherapy Home Support',
    patientName: 'Ananya Desai',
    paymentMethod: 'Direct Bank Deposit (NEFT)',
  },
  {
    id: 'TXN-98105',
    date: '22 Jul 2026',
    amount: 950,
    status: 'PAID',
    serviceName: 'Wound Dressing & Vitals',
    patientName: 'Rajesh Khanna',
    paymentMethod: 'Direct Bank Deposit (NEFT)',
  },
];

const INITIAL_MOCK_THREADS: NurseMessageThread[] = [
  {
    id: 't-101',
    patientName: 'Aarav Sharma',
    patientAge: 68,
    patientGender: 'Male',
    serviceName: 'Post-Operative Wound Care',
    phone: '+91 98765 43210',
    online: true,
    unreadCount: 2,
    lastActive: 'Active now',
    messages: [
      {
        id: 'm-1',
        senderId: 'patient',
        text: 'Hello Nurse Keshav, what time will you arrive today for my knee dressing change?',
        timestamp: '09:15 AM',
        status: 'read',
      },
      {
        id: 'm-2',
        senderId: 'nurse',
        text: 'Good morning Mr. Sharma! I am scheduled for the 10:00 AM slot. Leaving clinic now!',
        timestamp: '09:18 AM',
        status: 'read',
      },
      {
        id: 'm-3',
        senderId: 'patient',
        text: 'Great! My son is at home and will let you in. Had slight stiffness in my calf this morning.',
        timestamp: '09:25 AM',
      },
    ],
  },
  {
    id: 't-102',
    patientName: 'Priya Patel',
    patientAge: 42,
    patientGender: 'Female',
    serviceName: 'IV Therapy & Injection',
    phone: '+91 98111 22334',
    online: false,
    unreadCount: 0,
    lastActive: '30 mins ago',
    messages: [
      {
        id: 'm-4',
        senderId: 'patient',
        text: 'Hi! Confirming that the IV iron ampoules were delivered by the pharmacy.',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-5',
        senderId: 'nurse',
        text: 'Wonderful, thank you Priya. Please store them in a cool place. See you at 2:00 PM!',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },
];

const initialState: NurseState = {
  status: 'APPROVED',
  appointments: INITIAL_MOCK_APPOINTMENTS,
  transactions: INITIAL_MOCK_TRANSACTIONS,
  messageThreads: INITIAL_MOCK_THREADS,
  availability: {
    days: [
      { day: 'Mon', active: true, hours: '08:00 AM - 08:00 PM' },
      { day: 'Tue', active: true, hours: '08:00 AM - 08:00 PM' },
      { day: 'Wed', active: true, hours: '08:00 AM - 08:00 PM' },
      { day: 'Thu', active: true, hours: '08:00 AM - 08:00 PM' },
      { day: 'Fri', active: true, hours: '08:00 AM - 08:00 PM' },
      { day: 'Sat', active: false, hours: 'Off' },
      { day: 'Sun', active: false, hours: 'Off' },
    ],
    shiftPreferences: { morning: true, afternoon: true, evening: false, night: false },
    onDutyNow: true,
  },
  bankAccount: {
    bankName: 'HDFC Bank',
    accountNumberMasked: '•••• •••• 4321',
    ifsc: 'HDFC0001234',
    holderName: 'Nurse Keshav Profile',
    verified: true,
  },
  loading: false,
};

export const nurseSlice = createSlice({
  name: 'nurse',
  initialState,
  reducers: {
    acceptAppointmentRequest: (state, action: PayloadAction<string>) => {
      const apt = state.appointments.find((a) => a.publicId === action.payload);
      if (apt) {
        apt.status = 'CONFIRMED';
      }
    },
    rejectAppointmentRequest: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const apt = state.appointments.find((a) => a.publicId === action.payload.id);
      if (apt) {
        apt.status = 'CANCELLED';
        apt.specialInstructions = `[Declined: ${action.payload.reason}] ${apt.specialInstructions || ''}`;
      }
    },
    startCareVisit: (state, action: PayloadAction<string>) => {
      const apt = state.appointments.find((a) => a.publicId === action.payload);
      if (apt) {
        apt.status = 'IN_PROGRESS';
        apt.checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    completeCareVisit: (state, action: PayloadAction<{ id: string; note: CareNotePublic }>) => {
      const apt = state.appointments.find((a) => a.publicId === action.payload.id);
      if (apt) {
        apt.status = 'COMPLETED';
        apt.checkOutTime = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        apt.careNotes = [...(apt.careNotes || []), action.payload.note];

        // Automatically create a paid earning transaction in Redux store!
        const newTxn: EarningTransactionPublic = {
          id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: apt.payoutAmount,
          status: 'PAID',
          serviceName: apt.serviceName,
          patientName: apt.patientName,
          paymentMethod: 'Direct Bank Deposit (NEFT)',
        };
        state.transactions.unshift(newTxn);
      }
    },
    sendCareMessage: (
      state,
      action: PayloadAction<{ threadId: string; text: string; attachment?: any }>,
    ) => {
      const thread = state.messageThreads.find((t) => t.id === action.payload.threadId);
      if (thread) {
        const newMsg: NurseMessage = {
          id: `m-${Date.now()}`,
          senderId: 'nurse',
          text: action.payload.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          attachment: action.payload.attachment,
        };
        thread.messages.push(newMsg);
        thread.lastActive = 'Just now';
      }
    },
    toggleOnDutyStatus: (state) => {
      state.availability.onDutyNow = !state.availability.onDutyNow;
    },
    updateAvailabilityDay: (
      state,
      action: PayloadAction<{ day: string; active: boolean; hours: string }>,
    ) => {
      const dayIdx = state.availability.days.findIndex((d) => d.day === action.payload.day);
      if (dayIdx !== -1) {
        state.availability.days[dayIdx] = action.payload;
      }
    },
    requestInstantPayout: (state) => {
      // Mark any pending as paid or create a payout summary
    },
  },
});

export const {
  acceptAppointmentRequest,
  rejectAppointmentRequest,
  startCareVisit,
  completeCareVisit,
  sendCareMessage,
  toggleOnDutyStatus,
  updateAvailabilityDay,
  requestInstantPayout,
} = nurseSlice.actions;

// Selectors
export const selectNurseAppointments = (state: RootState) =>
  state.nurse?.appointments || INITIAL_MOCK_APPOINTMENTS;
export const selectNurseTransactions = (state: RootState) =>
  state.nurse?.transactions || INITIAL_MOCK_TRANSACTIONS;
export const selectNurseMessageThreads = (state: RootState) =>
  state.nurse?.messageThreads || INITIAL_MOCK_THREADS;
export const selectNurseAvailability = (state: RootState) =>
  state.nurse?.availability || initialState.availability;
export const selectNurseStatus = (state: RootState) => state.nurse?.status || 'APPROVED';

export const selectNurseEarningsSummary = (state: RootState) => {
  const appointments = state.nurse?.appointments || INITIAL_MOCK_APPOINTMENTS;
  const transactions = state.nurse?.transactions || INITIAL_MOCK_TRANSACTIONS;

  const completedVisits = appointments.filter((a) => a.status === 'COMPLETED');
  const confirmedOrActive = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS',
  );

  const todayEarnings = completedVisits.reduce((sum, apt) => sum + apt.payoutAmount, 0);
  const weekEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const pendingPayout = confirmedOrActive.reduce((sum, apt) => sum + apt.payoutAmount, 0);

  return {
    todayEarnings,
    weekEarnings,
    pendingPayout,
    completedVisitsCount: completedVisits.length + transactions.length,
    transactions,
  };
};

export default nurseSlice.reducer;
