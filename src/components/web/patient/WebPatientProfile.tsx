"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { User, Phone, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function WebPatientProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-100 font-outfit">
          Your Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border max-w-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center">
              <User className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-muted-foreground">
                {user?.fullName || "Loading..."}
              </h2>
              <span className="text-xs text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
                Patient
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Full Name
              </label>
              {editing ? (
                <Input defaultValue={user?.fullName || ""} />
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {user?.fullName || "—"}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Email
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user?.email || "—"}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Phone
              </label>
              {editing ? (
                <Input defaultValue={user?.phone || ""} />
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user?.phone || "Not provided"}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Location
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                India
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 pt-4">
              <Button size="sm">Save Changes</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
