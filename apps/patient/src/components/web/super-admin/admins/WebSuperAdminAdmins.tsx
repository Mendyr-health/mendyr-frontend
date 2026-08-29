'use client';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, UserPlus } from 'lucide-react';
import { useAdmins } from '@/features/super-admin/useAdmins';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm text-sm';

export default function WebSuperAdminAdmins() {
  const {
    admins,
    loading,
    query,
    setQuery,
    showCreateModal,
    setShowCreateModal,
    newAdmin,
    setNewAdmin,
    creating,
    handleCreateAdmin,
    handleSuspend,
  } = useAdmins();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
          Admin Management
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Create Admin
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search admins..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none sm:w-96"
        />
      </div>

      <div className="bg-glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-4">
                    <div className="skeleton h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center text-sm">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <motion.tr
                  key={a.publicId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted"
                >
                  <td className="text-foreground px-4 py-3 text-sm">{a.fullName}</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">{a.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[hsl(260,60%,55%)]/10 px-2 py-1 text-xs text-[hsl(260,60%,55%)]">
                      {a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${a.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSuspend(a.publicId)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                      title={a.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                    >
                      {a.status === 'ACTIVE' ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div
          className="bg-muted/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border-border w-full max-w-md rounded-2xl border p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-foreground mb-4 text-lg font-semibold">Create New Admin</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newAdmin.fullName}
                onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                className={inputClass}
                placeholder="Full Name"
              />
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className={inputClass}
                placeholder="Email"
              />
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className={inputClass}
                placeholder="Password"
              />
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className={inputClass}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="border-border text-foreground flex-1 rounded-xl border py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={creating}
                className="bg-gradient-primary flex-1 rounded-xl py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
