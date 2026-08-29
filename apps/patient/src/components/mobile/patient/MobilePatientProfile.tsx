"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { User, Phone, MapPin, Mail, Camera, Save, X } from "lucide-react";
import { useState } from "react";

export default function MobilePatientProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="pb-24">
      {/* Header Profile Info (Avatar) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-6 relative"
      >
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg overflow-hidden">
             <User className="h-10 w-10 text-primary" />
          </div>
          {editing && (
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-md active:scale-95 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {user?.fullName || "Loading..."}
        </h2>
        <span className="text-sm text-primary font-medium mt-1">Patient</span>
      </motion.div>

      {/* Profile Details (Cards) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 px-2"
      >
        <div className="flex items-center justify-between px-2 mb-2">
           <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Info</h3>
           <button 
             onClick={() => setEditing(!editing)}
             className="text-sm text-primary font-medium active:opacity-70"
           >
             {editing ? "Cancel" : "Edit"}
           </button>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Full Name */}
          <div className="p-4 border-b border-border/50">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
            {editing ? (
              <input 
                type="text"
                defaultValue={user?.fullName || ""}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="flex items-center gap-3 text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.fullName || "—"}</span>
              </div>
            )}
          </div>

          {/* Email (read-only typically, or editable) */}
          <div className="p-4 border-b border-border/50">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <div className="flex items-center gap-3 text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user?.email || "—"}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="p-4 border-b border-border/50">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
            {editing ? (
              <input 
                type="tel"
                defaultValue={user?.phone || ""}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="flex items-center gap-3 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.phone || "Not provided"}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="p-4">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">India</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sticky Save Button (only visible when editing) */}
      <AnimatePresence>
        {editing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[72px] left-0 right-0 p-4 z-40"
          >
            <div className="flex gap-3">
              <button 
                onClick={() => setEditing(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground font-medium py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button 
                onClick={() => setEditing(false)}
                className="flex-[2] flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
