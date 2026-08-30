'use client';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Placeholder data for appointments
const upcomingAppointments = [
  {
    id: '1',
    provider: 'Sarah Jenkins',
    role: 'Nurse',
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    type: 'Home Visit',
    status: 'Upcoming',
  },
];

const pastAppointments = [
  {
    id: '2',
    provider: 'Dr. Michael Chen',
    role: 'Doctor',
    date: 'Oct 10, 2026',
    time: '2:30 PM - 3:00 PM',
    type: 'Telehealth',
    status: 'Completed',
  },
];

export default function MobilePatientAppointments() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground text-2xl font-bold">Appointments</h1>
        <p className="text-muted-foreground text-sm">Manage your care schedule</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card flex rounded-xl p-1"
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            activeTab === 'past'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Past
        </button>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border-border bg-card rounded-2xl border p-4 shadow-sm"
            >
              <div className="border-border/50 flex items-center justify-between border-b pb-3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="text-primary h-4 w-4" />
                  <span>{appointment.date}</span>
                </div>
                <div
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                    appointment.status === 'Upcoming'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {appointment.status}
                </div>
              </div>

              <div className="pt-3">
                <h3 className="text-foreground text-lg font-bold">{appointment.provider}</h3>
                <p className="text-primary text-sm font-medium">{appointment.role}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">{appointment.time}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">{appointment.type}</span>
                  </div>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="mt-4 flex gap-2">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-xl py-2 text-sm font-semibold">
                      Reschedule
                    </button>
                    <button className="bg-muted text-foreground hover:bg-muted/80 flex-1 rounded-xl py-2 text-sm font-semibold">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
            <div className="bg-muted rounded-full p-4">
              <Calendar className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mt-4 font-semibold">No appointments</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              You don&apos;t have any {activeTab} appointments.
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/services"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex rounded-xl px-6 py-2 text-sm font-semibold"
              >
                Book Care
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
