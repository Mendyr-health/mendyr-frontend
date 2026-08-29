import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-border relative border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="from-primary to-primary flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br">
                <Heart className="text-foreground h-5 w-5" />
              </div>
              <span className="font-outfit text-foreground text-xl font-bold">Mendyr</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Connecting patients with verified nurses and caregivers for premium at-home healthcare
              services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-muted-foreground mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary-light text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="text-muted-foreground mb-4 text-sm font-semibold">For Professionals</h3>
            <ul className="space-y-3">
              {[
                { label: 'Become a Nurse', href: '/become-a-nurse' },
                { label: 'Nurse Login', href: '/login' },
                { label: 'Join Waitlist', href: '/#waitlist' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary-light text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-muted-foreground mb-4 text-sm font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="text-primary h-4 w-4" />
                support@mendyr.app
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="text-primary h-4 w-4" />
                +91-XXXXXXXXXX
              </li>
              <li className="text-muted-foreground flex items-start gap-2 text-sm">
                <MapPin className="text-primary mt-0.5 h-4 w-4" />
                India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Mendyr. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-6 text-xs">
            <Link href="#" className="hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-muted-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
