"use client";

import { motion } from "framer-motion";
import { Shield, Plus, Users, Lock, Edit, Trash2, ShieldCheck } from "lucide-react";
import { mockRoles } from "@/features/super-admin/rolesData";

export default function MobileSuperAdminRoles() {
  return (
    <div className="pb-28 space-y-4">
      {/* Header */}
      <div className="px-2 pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Access control</p>
        </div>
      </div>

      {/* Roles List */}
      <div className="px-2 flex flex-col gap-3">
        {mockRoles.map((role, idx) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card border border-border rounded-3xl p-4 shadow-sm relative overflow-hidden"
          >
            {/* Background Icon (decorative) */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
              <ShieldCheck className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${
                  role.isSystem ? "bg-purple-500/10 text-purple-500" : "bg-primary/10 text-primary"
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base leading-tight">{role.name}</h3>
                    {role.isSystem && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold uppercase tracking-widest">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                </div>
              </div>
              
              {!role.isSystem && (
                <button className="p-2 rounded-full active:scale-95 transition-transform bg-muted text-foreground">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border/50">
              <div className="bg-muted/50 rounded-xl p-2.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-foreground">{role.permissions}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Perms</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-2.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-bold text-foreground">{role.users}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Users</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Add Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="fixed bottom-20 left-4 right-4 z-40"
      >
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform text-lg flex justify-center items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Role
        </button>
      </motion.div>
    </div>
  );
}
