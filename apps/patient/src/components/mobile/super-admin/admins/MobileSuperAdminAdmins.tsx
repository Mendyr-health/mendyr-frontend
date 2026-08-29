'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, ShieldOff, UserPlus, Filter, X } from 'lucide-react';
import { useAdmins } from '@/features/super-admin/useAdmins';

export default function MobileSuperAdminAdmins() {
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

  const inputClass =
    'w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground';

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Admins</h1>
          <p className="text-muted-foreground mt-1 text-sm">{admins.length} Total</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
        >
          <UserPlus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="sticky top-4 z-30 px-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-card/80 border-border focus:ring-primary/20 focus:border-primary text-foreground w-full rounded-2xl border py-3.5 pr-12 pl-10 text-base shadow-sm backdrop-blur-xl focus:ring-2 focus:outline-none"
          />
          <button className="bg-muted text-foreground absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Admins List */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border flex h-24 animate-pulse items-center gap-4 rounded-3xl border p-4"
            >
              <div className="bg-muted h-12 w-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-1/2 rounded"></div>
                <div className="bg-muted h-3 w-1/3 rounded"></div>
              </div>
            </div>
          ))
        ) : admins.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">No admins found.</div>
        ) : (
          admins.map((a, idx) => (
            <motion.div
              key={a.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border-border rounded-3xl border p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-sm ${
                      a.role === 'SUPER_ADMIN'
                        ? 'bg-purple-500/20 text-purple-500'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {a.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-foreground text-base leading-tight font-bold">
                      {a.fullName}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">{a.email}</p>
                    <div className="mt-2 flex gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          a.role === 'SUPER_ADMIN'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {a.role.replace('_', ' ')}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          a.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSuspend(a.publicId)}
                  className={`rounded-full p-2 transition-transform active:scale-95 ${
                    a.status === 'ACTIVE'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {a.status === 'ACTIVE' ? (
                    <ShieldOff className="h-5 w-5" />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Mobile Bottom Sheet Modal for Create Admin */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card border-border fixed right-0 bottom-0 left-0 z-50 rounded-t-[2rem] border-t p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-xl font-bold">Add New Admin</h3>
                  <p className="text-muted-foreground text-xs">Provide admin details</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-muted text-foreground rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                    className={inputClass}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className={inputClass}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className={inputClass}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateAdmin}
                disabled={creating}
                className="bg-primary text-primary-foreground shadow-primary/30 w-full rounded-2xl py-4 text-lg font-bold shadow-xl transition-transform active:scale-[0.98]"
              >
                {creating ? 'Creating...' : 'Create Admin'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
