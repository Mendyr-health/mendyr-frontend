"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldOff, UserPlus, Filter, X } from "lucide-react";
import { useAdmins } from "@/features/super-admin/useAdmins";

export default function MobileSuperAdminAdmins() {
  const { admins, loading, query, setQuery, showCreateModal, setShowCreateModal, newAdmin, setNewAdmin, creating, handleCreateAdmin, handleSuspend } = useAdmins();

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground";

  return (
    <div className="pb-28 space-y-4">
      {/* Header */}
      <div className="px-2 pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">{admins.length} Total</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-2 sticky top-4 z-30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-12 py-3.5 bg-card/80 backdrop-blur-xl border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm text-foreground"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-foreground">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admins List */}
      <div className="px-2 flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-4 h-24 animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : admins.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No admins found.</div>
        ) : (
          admins.map((a, idx) => (
            <motion.div
              key={a.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${
                    a.role === "SUPER_ADMIN" ? "bg-purple-500/20 text-purple-500" : "bg-primary/20 text-primary"
                  }`}>
                    {a.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base leading-tight">{a.fullName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        a.role === "SUPER_ADMIN" ? "bg-purple-500/10 text-purple-500" : "bg-primary/10 text-primary"
                      }`}>
                        {a.role.replace("_", " ")}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        a.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSuspend(a.publicId)}
                  className={`p-2 rounded-full active:scale-95 transition-transform ${
                    a.status === "ACTIVE" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {a.status === "ACTIVE" ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-[2rem] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Add New Admin</h3>
                  <p className="text-xs text-muted-foreground">Provide admin details</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-muted rounded-full text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                  <input type="text" value={newAdmin.fullName} onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })} className={inputClass} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                  <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className={inputClass} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
                  <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className={inputClass} placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Role</label>
                  <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} className={inputClass}>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleCreateAdmin} 
                disabled={creating} 
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform text-lg"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
