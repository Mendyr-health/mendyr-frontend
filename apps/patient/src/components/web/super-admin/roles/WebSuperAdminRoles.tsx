'use client';
import { motion } from 'framer-motion';
import { Shield, Plus, Users, Lock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { mockRoles } from '@/features/super-admin/rolesData';

export default function WebSuperAdminRoles() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-1">Manage role-based access control.</p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Create Role
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockRoles.map((role, idx) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-glass border-border rounded-xl border p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Shield className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground font-semibold">{role.name}</h3>
                    {role.isSystem && (
                      <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-semibold">
                        SYSTEM
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{role.description}</p>
                </div>
              </div>
              {!role.isSystem && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="text-muted-foreground h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>

            <div className="border-border mt-4 flex items-center gap-4 border-t pt-4">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Lock className="h-3.5 w-3.5" />
                {role.permissions} permissions
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Users className="h-3.5 w-3.5" />
                {role.users} users
              </div>
              <span className="text-muted-foreground/70 text-xs">Hierarchy: {role.hierarchy}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
