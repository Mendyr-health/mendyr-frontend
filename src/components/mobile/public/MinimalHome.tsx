"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { APP_TARGET_CONFIG } from "@/lib/app-target";
import { hapticTap } from "@/lib/haptics";

// The full marketing site (hero, services grid, FAQ, waitlist form, etc.) is
// meant for web visitors deciding whether to sign up. Inside the native app
// that decision is already made — the app was downloaded — so the home
// screen is just a minimal, branded launch point straight into auth,
// instead of re-showing the whole website in a frame.
export function MinimalHome() {
  const config = APP_TARGET_CONFIG[
    process.env.NEXT_PUBLIC_APP_TARGET === "provider" ? "provider" : "patient"
  ];

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-8 pt-safe pb-safe">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Image
          src="/mendyr.png"
          alt="Mendyr Logo"
          width={120}
          height={40}
          loading="eager"
          className="mb-8 h-10 w-auto object-contain"
        />
        <h1 className="mb-3 text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
          {config.displayName}
        </h1>
        <p className="max-w-xs text-muted-foreground">{config.tagline}</p>
      </div>

      <div className="w-full max-w-sm space-y-3 pb-8">
        <Link
          href={config.primaryCta.href}
          onClick={() => hapticTap()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {config.primaryCta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={config.secondaryCta.href}
          onClick={() => hapticTap()}
          className="flex h-12 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {config.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}
