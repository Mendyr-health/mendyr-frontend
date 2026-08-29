"use client";

import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Briefcase, Award, Heart, CheckCircle, FileText } from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { Input } from "@mendyr/shared-ui/src/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function WebNurseProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-outfit">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional information.</p>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border max-w-3xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground shadow-lg">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.fullName || "Nurse"}</h2>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full mt-1.5">
                Verified Nurse
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="shrink-0 w-full sm:w-auto h-10 rounded-xl px-4">
            {editing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", icon: User, value: user?.fullName },
            { label: "Email Address", icon: Mail, value: user?.email },
            { label: "Phone Number", icon: Phone, value: user?.phone || "Not set" },
            { label: "Location", icon: MapPin, value: "India" },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
              {editing && field.label !== "Email Address" ? (
                <Input defaultValue={field.value || ""} className="bg-muted/50 border-border h-11 rounded-xl" />
              ) : (
                <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 min-h-[44px]">
                  <field.icon className="h-4 w-4 text-primary shrink-0 opacity-80" />
                  <span className="truncate">{field.value || "—"}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex justify-end pt-6 border-t border-border/60 mt-8">
            <Button className="bg-primary text-primary-foreground font-semibold px-6 h-11 rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
              Save Changes
            </Button>
          </div>
        )}
      </motion.div>

      {/* Professional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border max-w-3xl"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2.5">
          <Briefcase className="h-5 w-5 text-primary" />
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience</label>
            {editing ? (
              <Input placeholder="e.g. 5 years in critical care" className="bg-muted/50 border-border h-11 rounded-xl" />
            ) : (
              <div className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 min-h-[44px] flex items-center">
                Not set
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qualifications</label>
            {editing ? (
              <Input placeholder="e.g. B.Sc Nursing, GNM" className="bg-muted/50 border-border h-11 rounded-xl" />
            ) : (
              <div className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 min-h-[44px] flex items-center">
                Not set
              </div>
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Certifications</label>
            {editing ? (
              <Input placeholder="e.g. BLS, ACLS" className="bg-muted/50 border-border h-11 rounded-xl" />
            ) : (
              <div className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 min-h-[44px] flex items-center">
                Not set
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status & Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border max-w-3xl"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2.5">
          <Award className="h-5 w-5 text-primary" />
          Status & Documents
        </h3>
        
        <div className="space-y-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start sm:items-center gap-4">
            <div className="bg-emerald-500/20 p-2.5 rounded-full shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-base">Approved & Verified</h4>
              <p className="text-sm text-emerald-600/90 mt-0.5">Your profile is active. You can accept patient care bookings.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Uploaded Documents</h4>
            <div className="space-y-3">
              {[
                { name: "Nursing License", status: "Verified", date: "Oct 12, 2025" },
                { name: "Aadhaar Card", status: "Verified", date: "Oct 12, 2025" },
                { name: "Degree Certificate", status: "Verified", date: "Oct 12, 2025" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-2xl hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-sm shadow-primary/10 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Uploaded on {doc.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg shadow-sm border border-emerald-500/10">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
            
            {editing && (
              <Button variant="outline" className="w-full mt-4 border-dashed border-2 bg-transparent hover:bg-muted h-12 rounded-2xl">
                + Upload New Document
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
