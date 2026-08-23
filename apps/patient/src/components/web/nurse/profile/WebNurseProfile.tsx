"use client";

import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Briefcase, Award, Heart } from "lucide-react";
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
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{user?.fullName || "Nurse"}</h2>
              <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Nurse</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Full Name", icon: User, value: user?.fullName },
            { label: "Email", icon: Mail, value: user?.email },
            { label: "Phone", icon: Phone, value: user?.phone || "Not set" },
            { label: "Location", icon: MapPin, value: "India" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
              {editing && field.label !== "Email" ? (
                <Input defaultValue={field.value || ""} />
              ) : (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <field.icon className="h-4 w-4 text-muted-foreground" />
                  {field.value || "—"}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button size="sm">Save Changes</Button>
          </div>
        )}
      </motion.div>

      {/* Professional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Professional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Experience</label>
            {editing ? <Input placeholder="e.g. 5 years in critical care" /> : <p className="text-sm text-foreground">Not set</p>}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Qualifications</label>
            {editing ? <Input placeholder="e.g. B.Sc Nursing, GNM" /> : <p className="text-sm text-foreground">Not set</p>}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Certifications</label>
            {editing ? <Input placeholder="e.g. BLS, ACLS" /> : <p className="text-sm text-foreground">Not set</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
