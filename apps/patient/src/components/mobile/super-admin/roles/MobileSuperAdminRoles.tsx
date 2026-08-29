'use client';

import { motion } from 'framer-motion';
import { Shield, Plus, Users, Lock, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { mockRoles } from '@/features/super-admin/rolesData';

export default function MobileSuperAdminRoles() {
  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Roles</h1>
          <p className="text-muted-foreground mt-1 text-sm">Access control</p>
        </div>
      </div>

      {/* Roles List */}
      <div className="flex flex-col gap-3 px-2">
        {mockRoles.map((role, idx) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card border-border relative overflow-hidden rounded-3xl border p-4 shadow-sm"
          >
            {/* Background Icon (decorative) */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
              <ShieldCheck className="h-32 w-32" />
            </div>

            <div className="relative z-10 mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold shadow-sm ${
                    role.isSystem
                      ? 'bg-purple-500/10 text-purple-500'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground text-base leading-tight font-bold">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{role.description}</p>
                </div>
              </div>

              {!role.isSystem && (
                <button className="bg-muted text-foreground rounded-full p-2 transition-transform active:scale-95">
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="border-border/50 relative z-10 mt-2 grid grid-cols-2 gap-2 border-t pt-3">
              <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-2.5">
                <Lock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-foreground text-sm font-bold">{role.permissions}</p>
                  <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Perms
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-2.5">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-foreground text-sm font-bold">{role.users}</p>
                  <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Users
                  </p>
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
        className="fixed right-4 bottom-20 left-4 z-40"
      >
        <button className="bg-primary text-primary-foreground shadow-primary/30 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold shadow-xl transition-transform active:scale-[0.98]">
          <Plus className="h-5 w-5" />
          Create New Role
        </button>
      </motion.div>
    </div>
  );
}
