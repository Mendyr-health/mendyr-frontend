'use client';

import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';

const mockDocuments = [
  {
    name: 'Aadhaar Card',
    type: 'AADHAAR',
    status: 'verified',
    fileName: 'aadhaar.pdf',
    date: 'Oct 12, 2023',
  },
  {
    name: 'Nursing Certificate',
    type: 'CERTIFICATE',
    status: 'pending',
    fileName: 'certificate.pdf',
    date: 'Oct 15, 2023',
  },
  { name: 'Profile Photo', type: 'PROFILE_PHOTO', status: 'pending', fileName: null, date: null },
];

const statusStyles: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  verified: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  pending: { icon: <Clock className="h-4 w-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  rejected: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function MobileNurseDocuments() {
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-foreground text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your credentials</p>
      </div>

      {/* Progress Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-2">
        <div className="bg-primary/10 border-primary/20 rounded-3xl border p-5 shadow-sm">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-primary mb-1 text-xs font-bold tracking-wider uppercase">
                Verification
              </p>
              <h3 className="text-foreground text-xl font-bold">1 of 3 Verified</h3>
            </div>
            <div className="border-primary/20 border-t-primary flex h-12 w-12 items-center justify-center rounded-full border-4">
              <span className="text-primary text-xs font-bold">33%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Document List */}
      <div className="flex flex-col gap-3 px-2 pt-2">
        {mockDocuments.map((doc, idx) => {
          const style = statusStyles[doc.status];
          return (
            <motion.div
              key={doc.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="bg-card border-border rounded-3xl border p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg} ${style.color}`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">{doc.name}</h3>
                    {doc.fileName ? (
                      <p className="text-muted-foreground text-xs">{doc.fileName}</p>
                    ) : (
                      <p className="text-xs font-medium text-red-500">Missing Document</p>
                    )}
                  </div>
                </div>
                <button className="hover:bg-muted text-muted-foreground rounded-full p-1.5 transition-transform active:scale-95">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="border-border/50 flex items-center justify-between border-t pt-3">
                <div className={`flex items-center gap-1.5 ${style.color}`}>
                  {style.icon}
                  <span className="text-xs font-bold tracking-wider uppercase">{doc.status}</span>
                </div>

                <button className="bg-muted text-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-transform active:scale-95">
                  <Upload className="h-3.5 w-3.5" />
                  {doc.fileName ? 'Replace' : 'Upload'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
