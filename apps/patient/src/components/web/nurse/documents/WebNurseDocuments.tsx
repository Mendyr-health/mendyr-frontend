"use client";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";

const mockDocuments = [
  { name: "Aadhaar Card", type: "AADHAAR", status: "verified", fileName: "aadhaar.pdf" },
  { name: "Nursing Certificate", type: "CERTIFICATE", status: "pending", fileName: "certificate.pdf" },
  { name: "Profile Photo", type: "PROFILE_PHOTO", status: "pending", fileName: null },
];

const statusIcons: Record<string, React.ReactNode> = {
  verified: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

export default function WebNurseDocuments() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-outfit">Documents</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your verification documents.</p>
      </motion.div>

      <div className="space-y-4 max-w-2xl">
        {mockDocuments.map((doc, idx) => (
          <motion.div
            key={doc.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-glass rounded-xl p-5 border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {statusIcons[doc.status]}
                    <span className="text-xs text-muted-foreground capitalize">{doc.status}</span>
                    {doc.fileName && (
                      <span className="text-xs text-muted-foreground/70">• {doc.fileName}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                {doc.fileName ? "Replace" : "Upload"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
