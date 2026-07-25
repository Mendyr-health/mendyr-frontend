"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { FloatingNavbar } from "@/components/aceternity";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";

import { Home, Stethoscope, Info, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const iconMap: Record<string, React.ElementType> = {
    Home, Services: Stethoscope, "About Us": Info, Contact: Phone
  };

  // Determine bottom nav items (max 3 slots + 1 Menu on mobile)
  const bottomNavLinks = PUBLIC_NAV_LINKS.slice(0, 3);
  const moreLinks = PUBLIC_NAV_LINKS.slice(3);

  return (
    <>
      {/* Desktop Floating Navbar */}
      <div className="hidden md:block">
        <FloatingNavbar>
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/mendyr.png" alt="Mendyr Logo" width={120} height={40} loading="eager" className="h-8 w-auto object-contain" style={{ width: "auto" }} />
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-1">
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

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:bg-white/50 text-foreground transition-all px-5 py-2.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register/patient"
                className="text-sm px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(5,17,242,0.3)] border border-white/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </FloatingNavbar>
      </div>

      {/* Mobile Top Header (Minimal) */}
      <header className="md:hidden h-16 px-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <Image src="/mendyr.png" alt="Mendyr Logo" width={100} height={32} loading="eager" className="h-7 w-auto object-contain" />
        <Link
          href="/register/patient"
          className="text-xs px-4 py-2 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 shadow-md"
        >
          Sign Up
        </Link>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-background/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 pb-safe z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {bottomNavLinks.map((link) => {
          const Icon = iconMap[link.label] || Home;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
              </motion.div>
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMobileOpen(true)}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
            mobileOpen ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <motion.div whileTap={{ scale: 0.9 }}>
            <Menu className="w-6 h-6" />
          </motion.div>
          <span className="text-[10px] font-medium tracking-wide">More</span>
        </button>
      </nav>

      {/* Mobile Bottom Sheet Drawer for "More" */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden max-h-[85vh] flex flex-col pb-safe"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
              
              <div className="px-6 pb-2 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-semibold">More Options</h2>
                <button onClick={() => setMobileOpen(false)} className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto px-4 pb-8 flex flex-col gap-2 mt-2">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-6 py-4 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-border my-4 mx-4" />
                
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 text-center text-lg font-medium text-foreground bg-muted/30 rounded-2xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register/patient"
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 text-center text-lg font-semibold rounded-2xl bg-gradient-primary text-white shadow-lg shadow-primary/30 mt-2"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
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
      <div className="max-w-7xl mx-auto px-6 py-16 pb-24 md:pb-16">
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
              <ul className="space-y-4 md:space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base md:text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
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
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Mendyr. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm md:text-xs text-muted-foreground">
              Made with <Heart className="w-4 h-4 md:w-3 md:h-3 inline text-red-400" /> for better healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
