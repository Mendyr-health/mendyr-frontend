"use client";

import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Briefcase, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function MobileNurseProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <button 
          onClick={() => setEditing(!editing)} 
          className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${editing ? "bg-muted text-foreground" : "bg-primary/10 text-primary"}`}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Avatar Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center pt-2"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-lg text-primary-foreground text-3xl font-bold">
            {user?.fullName?.charAt(0) || "N"}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mt-4">{user?.fullName || "Nurse"}</h2>
        <p className="text-sm text-emerald-500 font-medium mt-1">Verified Nurse</p>
      </motion.div>

      {/* Personal Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-2"
      >
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Personal Information</h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "Email", icon: Mail, value: user?.email, editable: false },
            { label: "Phone", icon: Phone, value: user?.phone || "", editable: true, placeholder: "Enter phone number" },
            { label: "Location", icon: MapPin, value: "India", editable: true, placeholder: "Enter location" },
          ].map((field, idx, arr) => (
            <div key={field.label} className={`p-4 flex flex-col gap-1 ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <field.icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{field.label}</span>
              </div>
              {editing && field.editable ? (
                <input 
                  type="text" 
                  defaultValue={field.value} 
                  placeholder={field.placeholder}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              ) : (
                <p className={`text-sm font-medium ${field.value ? "text-foreground" : "text-muted-foreground italic"}`}>
                  {field.value || "Not provided"}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Professional Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-2"
      >
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Professional Info
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "Experience", placeholder: "e.g. 5 years in critical care" },
            { label: "Qualifications", placeholder: "e.g. B.Sc Nursing, GNM" },
            { label: "Certifications", placeholder: "e.g. BLS, ACLS" },
          ].map((field, idx, arr) => (
            <div key={field.label} className={`p-4 flex flex-col gap-1 ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <span className="text-xs font-semibold text-muted-foreground mb-1">{field.label}</span>
              {editing ? (
                <input 
                  type="text" 
                  placeholder={field.placeholder}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">Not provided</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Save Button */}
      {editing && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="fixed bottom-20 left-4 right-4 z-40"
        >
          <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform text-lg">
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
}
