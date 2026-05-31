"use client";
import { motion } from "framer-motion";
import { Shield, Plus, Users, Lock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRoles = [
  { name: "Super Admin", slug: "super-admin", hierarchy: 0, isSystem: true, permissions: 30, users: 1, description: "Full system access" },
  { name: "Admin", slug: "admin", hierarchy: 1, isSystem: true, permissions: 15, users: 2, description: "Platform management access" },
  { name: "Nurse", slug: "nurse", hierarchy: 2, isSystem: true, permissions: 3, users: 0, description: "Nurse portal access" },
  { name: "Patient", slug: "patient", hierarchy: 3, isSystem: true, permissions: 3, users: 0, description: "Patient portal access" },
];

export default function SuperAdminRolesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 font-outfit">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-1">Manage role-based access control.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Create Role
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoles.map((role, idx) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-glass rounded-xl p-5 border border-border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary-light" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-muted-foreground">{role.name}</h3>
                    {role.isSystem && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        SYSTEM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                </div>
              </div>
              {!role.isSystem && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                {role.permissions} permissions
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {role.users} users
              </div>
              <span className="text-xs text-neutral-600">Hierarchy: {role.hierarchy}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
