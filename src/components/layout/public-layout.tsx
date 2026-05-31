"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { FloatingNavbar } from "@/components/aceternity";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <FloatingNavbar>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/mendyr.png" alt="Mendyr Logo" width={120} height={40} loading="eager" className="h-8 w-auto object-contain" style={{ width: "auto" }} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:bg-white/50 text-foreground transition-all px-5 py-2.5 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/register/patient"
              className="hidden md:inline-flex text-sm px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(5,17,242,0.3)] border border-white/20"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </FloatingNavbar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-4 top-24 bg-glass-strong rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex flex-col gap-2">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-muted-foreground hover:text-foreground rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register/patient"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-center rounded-xl bg-gradient-primary text-white font-medium shadow-[0_4px_20px_rgba(5,17,242,0.3)] border border-white/20"
              >
                Get Started
              </Link>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PublicFooter() {
  const footerLinks = {
    Services: [
      { label: "Home Nursing", href: "/services/home-nursing" },
      { label: "Elder Care", href: "/services/elder-care-support" },
      { label: "Physiotherapy", href: "/services/physiotherapy" },
      { label: "Post-Operative Care", href: "/services/post-operative-care" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Become a Nurse", href: "/become-a-nurse" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/mendyr.png" loading="eager" alt="Mendyr Logo" width={120} height={40} className="h-8 w-auto object-contain" style={{ width: "auto" }} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting patients with verified nurses and caregivers for
              professional at-home healthcare services.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mendyr. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Made with <Heart className="w-3 h-3 inline text-red-400" /> for better healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
