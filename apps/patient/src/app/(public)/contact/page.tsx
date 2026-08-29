'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, MapPin, Mail, Phone } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-foreground mb-4 font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a question? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="h-5 w-5" />, label: 'Email', value: 'support@mendyr.app' },
              { icon: <Phone className="h-5 w-5" />, label: 'Phone', value: '+91 (800) 000-0000' },
              { icon: <MapPin className="h-5 w-5" />, label: 'Location', value: 'India' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-glass flex items-start gap-4 rounded-xl p-6"
              >
                <div className="bg-gradient-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  {item.icon}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{item.label}</p>
                  <p className="text-foreground font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass rounded-2xl p-8 md:col-span-2"
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="text-success mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-xl font-semibold">Message Sent!</h3>
                <p className="text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1.5 block text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-sidebar border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1.5 block text-sm">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-sidebar border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1.5 block text-sm">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-sidebar border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1.5 block text-sm">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="bg-sidebar border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1.5 block text-sm">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-sidebar border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full resize-none rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
