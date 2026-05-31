import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-muted"
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
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <Image src="/mendyr.png" alt="Mendyr Logo" width={160} height={48} className="h-12 w-auto object-contain" style={{ width: "auto" }} />
          </Link>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            Healthcare That Comes Home
          </h2>
          <p className="text-muted-foreground max-w-md">
            Join thousands of patients and nurses building a better healthcare future together.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image src="/mendyr.png" alt="Mendyr Logo" width={120} height={40} className="h-8 w-auto object-contain" style={{ width: "auto" }} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
