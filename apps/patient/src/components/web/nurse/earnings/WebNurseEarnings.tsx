"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppointments } from "@/features/nurse/useAppointments";
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
} from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { toast } from "sonner";

export default function WebNurseEarnings() {
  const { getEarningsSummary } = useAppointments();
  const summary = getEarningsSummary();
  const [requesting, setRequesting] = useState(false);

  const handleRequestPayout = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      toast.success("Payout Request Submitted!", {
        description: `₹${summary.pendingPayout.toLocaleString("en-IN")} is being transferred to your HDFC Bank account ending in ****4321.`,
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-outfit flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-emerald-400" />
            Earnings & Financial Overview
          </h1>
          <p className="text-muted-foreground mt-1">Track your daily earnings, completed shift rewards, and bank transfers.</p>
        </div>
        <Button
          onClick={handleRequestPayout}
          disabled={requesting || summary.pendingPayout === 0}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold gap-2 shadow-lg shadow-emerald-500/20 px-6 h-12 rounded-xl"
        >
          <Sparkles className="h-4 w-4" />
          {requesting ? "Processing Payout..." : `Transfer ₹${summary.pendingPayout.toLocaleString("en-IN")} to Bank`}
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Today's Earnings",
            amount: `₹${summary.todayEarnings.toLocaleString("en-IN")}`,
            desc: "Earned from today's care sessions",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/30",
          },
          {
            title: "This Week",
            amount: `₹${summary.weekEarnings.toLocaleString("en-IN")}`,
            desc: "Total completed sessions this week",
            icon: Calendar,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/30",
          },
          {
            title: "Pending Payout",
            amount: `₹${summary.pendingPayout.toLocaleString("en-IN")}`,
            desc: "Scheduled & in-progress shifts",
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/30",
          },
          {
            title: "Total Completed Care Visits",
            amount: `${summary.completedVisitsCount}`,
            desc: "Verified 5-star patient reviews",
            icon: CheckCircle2,
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/30",
          },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-glass rounded-2xl p-6 border border-border flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">{card.title}</span>
              <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl md:text-3xl font-black text-foreground font-outfit">{card.amount}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bank Details & Payout Guarantee Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 via-glass to-glass rounded-2xl p-6 md:p-8 border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/20 text-primary shrink-0">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              Connected Account: HDFC Bank •••• 4321
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              IFSC: HDFC0001234 | Account Holder: Nurse Profile • Instant payouts occur within 2 hours of shift completion.
            </p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0 gap-2 border-border hover:bg-muted">
          <CreditCard className="h-4 w-4" /> Change Bank Account
        </Button>
      </motion.div>

      {/* Recent Payout Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-glass rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Shift Payouts</h3>
            <p className="text-sm text-muted-foreground">Complete history of direct bank transfers and earnings.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Statement (PDF)
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Patient & Service</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {summary.transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No payout transactions yet. Complete your first care visit to see your earnings here!
                  </td>
                </tr>
              ) : (
                summary.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-foreground">{tx.patientName}</div>
                      <div className="text-xs text-primary font-medium">{tx.serviceName}</div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{tx.date}</td>
                    <td className="py-4 px-6 text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" /> {tx.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-foreground font-outfit text-base">
                      ₹{tx.amount.toLocaleString("en-IN")}
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
