'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mendyr/shared-ui/src/ui/card';
import { Calendar } from 'lucide-react';

export default function WebPatientAppointments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Manage your scheduled care visits.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your next scheduled visits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 opacity-20" />
            <p>You have no upcoming appointments.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
