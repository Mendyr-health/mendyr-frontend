"use client";
import { motion } from "framer-motion";
import { Search, Shield, ShieldOff, UserPlus } from "lucide-react";
import { useAdmins } from "@/features/super-admin/useAdmins";

const inputClass = "w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm text-sm";

export default function WebSuperAdminAdmins() {
  const { admins, loading, query, setQuery, showCreateModal, setShowCreateModal, newAdmin, setNewAdmin, creating, handleCreateAdmin, handleSuspend } = useAdmins();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">Admin Management</h1>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90">
          <UserPlus className="w-4 h-4" /> Create Admin
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search admins..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="bg-glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {["Name", "Email", "Role", "Status", "Created", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td></tr>) : admins.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No admins found</td></tr> : admins.map((a) => (
              <motion.tr key={a.publicId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted">
                <td className="px-4 py-3 text-sm text-foreground">{a.fullName}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{a.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-[hsl(260,60%,55%)]/10 text-[hsl(260,60%,55%)]">{a.role}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${a.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{a.status}</span></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleSuspend(a.publicId)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500" title={a.status === "ACTIVE" ? "Suspend" : "Reactivate"}>
                    {a.status === "ACTIVE" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-muted/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-2xl p-6 w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Admin</h3>
            <div className="space-y-4">
              <input type="text" value={newAdmin.fullName} onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })} className={inputClass} placeholder="Full Name" />
              <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className={inputClass} placeholder="Email" />
              <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className={inputClass} placeholder="Password" />
              <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} className={inputClass}>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-foreground">Cancel</button>
              <button onClick={handleCreateAdmin} disabled={creating} className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-medium disabled:opacity-50">{creating ? "Creating..." : "Create"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
