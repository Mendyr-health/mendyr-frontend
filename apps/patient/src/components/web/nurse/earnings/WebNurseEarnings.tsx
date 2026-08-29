'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppointments } from '@/features/nurse/useAppointments';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Building2,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { toast } from 'sonner';

export default function WebNurseEarnings() {
  const { getEarningsSummary } = useAppointments();
  const summary = getEarningsSummary();
  const [requesting, setRequesting] = useState(false);

  const handleRequestPayout = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      toast.success('Payout Request Submitted!', {
        description: `₹${summary.pendingPayout.toLocaleString('en-IN')} is being transferred to your HDFC Bank account ending in ****4321.`,
      });
    }, 1200);
  };

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
            <DollarSign className="h-8 w-8 text-emerald-400" />
            Earnings & Financial Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your daily earnings, completed shift rewards, and bank transfers.
          </p>
        </div>
        <Button
          onClick={handleRequestPayout}
          disabled={requesting || summary.pendingPayout === 0}
          className="h-12 gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
        >
          <Sparkles className="h-4 w-4" />
          {requesting
            ? 'Processing Payout...'
            : `Transfer ₹${summary.pendingPayout.toLocaleString('en-IN')} to Bank`}
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Today's Earnings",
            amount: `₹${summary.todayEarnings.toLocaleString('en-IN')}`,
            desc: "Earned from today's care sessions",
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/30',
          },
          {
            title: 'This Week',
            amount: `₹${summary.weekEarnings.toLocaleString('en-IN')}`,
            desc: 'Total completed sessions this week',
            icon: Calendar,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/30',
          },
          {
            title: 'Pending Payout',
            amount: `₹${summary.pendingPayout.toLocaleString('en-IN')}`,
            desc: 'Scheduled & in-progress shifts',
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/30',
          },
          {
            title: 'Total Completed Care Visits',
            amount: `${summary.completedVisitsCount}`,
            desc: 'Verified 5-star patient reviews',
            icon: CheckCircle2,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/30',
          },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-glass border-border flex flex-col justify-between rounded-2xl border p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-semibold">{card.title}</span>
              <div className={`rounded-xl border p-2.5 ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-foreground font-outfit text-2xl font-black md:text-3xl">
                {card.amount}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bank Details & Payout Guarantee Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="from-primary/10 via-glass to-glass border-primary/20 flex flex-col items-start justify-between gap-6 rounded-2xl border bg-gradient-to-r p-6 md:flex-row md:items-center md:p-8"
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 text-primary shrink-0 rounded-2xl p-4">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
              Connected Account: HDFC Bank •••• 4321
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              IFSC: HDFC0001234 | Account Holder: Nurse Profile • Instant payouts occur within 2
              hours of shift completion.
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-border hover:bg-muted shrink-0 gap-2">
          <CreditCard className="h-4 w-4" /> Change Bank Account
        </Button>
      </motion.div>

      {/* Recent Payout Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-glass border-border overflow-hidden rounded-2xl border"
      >
        <div className="border-border flex items-center justify-between border-b p-6">
          <div>
            <h3 className="text-foreground text-lg font-bold">Recent Shift Payouts</h3>
            <p className="text-muted-foreground text-sm">
              Complete history of direct bank transfers and earnings.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Statement (PDF)
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-border bg-muted/30 text-muted-foreground border-b text-xs font-semibold tracking-wider uppercase">
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Patient & Service</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y text-sm">
              {summary.transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted-foreground py-8 text-center">
                    No payout transactions yet. Complete your first care visit to see your earnings
                    here!
                  </td>
                </tr>
              ) : (
                summary.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                    <td className="text-muted-foreground px-6 py-4 font-mono text-xs">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-bold">{tx.patientName}</div>
                      <div className="text-primary text-xs font-medium">{tx.serviceName}</div>
                    </td>
                    <td className="text-muted-foreground px-6 py-4">{tx.date}</td>
                    <td className="text-muted-foreground flex items-center gap-1.5 px-6 py-4">
                      <Building2 className="text-primary h-3.5 w-3.5" /> {tx.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    </td>
                    <td className="text-foreground font-outfit px-6 py-4 text-right text-base font-bold">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
