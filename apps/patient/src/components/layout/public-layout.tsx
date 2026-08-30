'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import { FloatingNavbar } from '@/components/aceternity';
import { PUBLIC_NAV_LINKS } from '@mendyr/shared-utils';

import { Home, Stethoscope, Info, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { usePlatform } from '@mendyr/shared-utils';
import { IS_PATIENT_APP, IS_PROVIDER_APP } from '@/lib/app-target';

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isCapacitor } = usePlatform();

  const iconMap: Record<string, React.ElementType> = {
    Home,
    Services: Stethoscope,
    'About Us': Info,
    Contact: Phone,
  };

  // Determine bottom nav items (max 3 slots + 1 Menu on mobile)
  const bottomNavLinks = PUBLIC_NAV_LINKS.slice(0, 3);
  const moreLinks = PUBLIC_NAV_LINKS.slice(3);

  return (
    <>
      {/* Desktop Floating Navbar */}
      <div className="hidden md:block">
        <FloatingNavbar>
          <div className="flex w-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/mendyr.png"
                alt="Mendyr Logo"
                width={120}
                height={40}
                loading="eager"
                className="h-8 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-1">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-foreground rounded-xl border border-white/50 bg-white/30 px-5 py-2.5 text-sm shadow-sm backdrop-blur-md transition-all hover:bg-white/50"
              >
                Sign In
              </Link>
              {(!isCapacitor || IS_PATIENT_APP) && (
                <Link
                  href="/register/patient"
                  className="bg-gradient-primary rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(5,17,242,0.3)] transition-all hover:opacity-90"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </FloatingNavbar>
      </div>

      {/* Mobile Top Header (Minimal) */}
      <header className="pt-safe border-border bg-background/80 sticky top-0 z-30 flex min-h-[4rem] items-center justify-between border-b px-4 backdrop-blur-md md:hidden">
        <Image
          src="/mendyr.png"
          alt="Mendyr Logo"
          width={100}
          height={32}
          loading="eager"
          className="h-7 w-auto object-contain"
        />
        {!isCapacitor && (
          <Link
            href="/register/patient"
            className="bg-gradient-primary rounded-xl px-4 py-2 text-xs font-medium text-white shadow-md hover:opacity-90"
          >
            Sign Up
          </Link>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bg-background/90 border-border pb-safe fixed right-0 bottom-0 left-0 z-40 flex min-h-[70px] items-center justify-around border-t px-2 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden">
        {bottomNavLinks.map((link) => {
          const Icon = iconMap[link.label] || Home;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
              </motion.div>
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMobileOpen(true)}
          className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-all ${
            mobileOpen ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <motion.div whileTap={{ scale: 0.9 }}>
            <Menu className="h-6 w-6" />
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
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-background pb-safe fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex shrink-0 justify-center pt-3 pb-2">
                <div className="bg-muted h-1.5 w-12 rounded-full" />
              </div>

              <div className="flex shrink-0 items-center justify-between px-6 pb-2">
                <h2 className="text-xl font-semibold">More Options</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="bg-muted/50 hover:bg-muted rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-2 flex flex-col gap-2 overflow-y-auto px-4 pb-8">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl px-6 py-4 text-lg font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-border mx-4 my-4 border-t" />

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground bg-muted/30 rounded-2xl px-6 py-4 text-center text-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                {!isCapacitor && (
                  <Link
                    href="/register/patient"
                    onClick={() => setMobileOpen(false)}
                    className="bg-gradient-primary shadow-primary/30 mt-2 rounded-2xl px-6 py-4 text-center text-lg font-semibold text-white shadow-lg"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function PublicFooter() {
  const { isCapacitor } = usePlatform();

  const footerLinks = {
    Services: [
      { label: 'Home Nursing', href: '/services/home-nursing' },
      { label: 'Elder Care', href: '/services/elder-care-support' },
      { label: 'Physiotherapy', href: '/services/physiotherapy' },
      { label: 'Post-Operative Care', href: '/services/post-operative-care' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  if (!isCapacitor || IS_PROVIDER_APP) {
    footerLinks.Company.push({ label: 'Become a Nurse', href: '/become-a-nurse' });
  }

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 pb-24 md:pb-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/mendyr.png"
                loading="eager"
                alt="Mendyr Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting patients with verified nurses and caregivers for professional at-home
              healthcare services.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                {category}
              </h4>
              <ul className="space-y-4 md:space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary block py-1 text-base transition-colors md:text-sm"
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
        <div className="border-border mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row md:gap-4">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            © {new Date().getFullYear()} Mendyr. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-sm md:text-xs">
              Made with <Heart className="inline h-4 w-4 text-red-400 md:h-3 md:w-3" /> for better
              healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
