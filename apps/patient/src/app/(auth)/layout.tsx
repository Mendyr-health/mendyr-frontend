import { Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100svh] w-full flex-col lg:flex-row overflow-y-auto">
      {/* Left Panel — Branding */}
      <div className="from-primary-dark to-background relative hidden items-center justify-center overflow-hidden bg-gradient-to-br p-12 lg:flex lg:w-1/2">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted absolute rounded-full"
              style={{
                width: `${100 + i * 80}px`,
                height: `${100 + i * 80}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            <Image
              src="/mendyr.png"
              alt="Mendyr Logo"
              width={160}
              height={48}
              loading="eager"
              className="h-12 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </Link>
          <h2 className="text-muted-foreground mb-4 text-2xl font-semibold">
            Healthcare That Comes Home
          </h2>
          <p className="text-muted-foreground max-w-md">
            Join thousands of patients and nurses building a better healthcare future together.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="pt-safe pb-safe flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Image
              src="/mendyr.png"
              alt="Mendyr Logo"
              width={120}
              height={40}
              loading="eager"
              className="h-8 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
