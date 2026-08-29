export type Appointment = {
  id: string;
  service: string;
  clinician: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending';
};

export type NearbyProvider = {
  id: string;
  name: string;
  role: 'Nurse' | 'Doctor' | 'Pharmacist';
  specialty: string;
  distance: string;
  rating: number;
  availability: string;
};

// Temporary client-side data. Replace these exports with patient API data when
// the patient endpoints are available.
export const patientDashboardData = {
  appointments: [
    {
      id: 'visit-1',
      service: 'Home nursing visit',
      clinician: 'Priya Sharma, RN',
      date: 'Tomorrow',
      time: '10:00 AM – 11:00 AM',
      status: 'Confirmed',
    },
    {
      id: 'visit-2',
      service: 'Physiotherapy session',
      clinician: 'Arjun Mehta, PT',
      date: 'Fri, 28 Aug',
      time: '4:30 PM – 5:15 PM',
      status: 'Pending',
    },
  ] satisfies Appointment[],
  nearbyProviders: [
    {
      id: 'provider-1',
      name: 'Priya Sharma',
      role: 'Nurse',
      specialty: 'Home nursing · 8 years exp.',
      distance: '1.2 km away',
      rating: 4.9,
      availability: 'Available today',
    },
    {
      id: 'provider-2',
      name: 'Dr. Rohan Mehta',
      role: 'Doctor',
      specialty: 'General physician',
      distance: '2.4 km away',
      rating: 4.8,
      availability: 'Next slot: 4:30 PM',
    },
    {
      id: 'provider-3',
      name: 'CarePlus Pharmacy',
      role: 'Pharmacist',
      specialty: 'Prescription & medicine delivery',
      distance: '0.8 km away',
      rating: 4.7,
      availability: 'Open until 10:00 PM',
    },
  ] satisfies NearbyProvider[],
  carePlan: {
    title: 'Recovery & mobility plan',
    completed: 3,
    total: 5,
    nextStep: 'Complete your daily mobility check-in.',
  },
  healthSummary: [
    { label: 'Blood pressure', value: '118/76', unit: 'mmHg' },
    { label: 'Heart rate', value: '72', unit: 'bpm' },
    { label: 'Blood sugar', value: '104', unit: 'mg/dL' },
  ],
  emergencyContact: {
    name: 'Anita Kumar',
    relationship: 'Emergency contact · Sister',
    phone: '+91 98765 43210',
  },
} as const;
