'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import { APP_TARGET_CONFIG } from '@/lib/app-target';
import { hapticTap } from '@/lib/haptics';
import { Carousel, CarouselItem } from '@mendyr/shared-ui/src/ui/carousel';
import { Card, CardContent } from '@mendyr/shared-ui/src/ui/card';

const PATIENT_FEATURES = [
  { icon: HeartHandshake, title: 'Premium Care', desc: 'Top-tier healthcare delivered directly to your home.' },
  { icon: Clock, title: 'On-Demand', desc: 'Book verified nurses for your preferred time window.' },
  { icon: ShieldCheck, title: 'Verified Pros', desc: 'All caregivers are thoroughly vetted and background-checked.' },
];

const PROVIDER_FEATURES = [
  { icon: Clock, title: 'Flexible Hours', desc: 'Work when you want, where you want.' },
  { icon: ShieldCheck, title: 'Secure Payouts', desc: 'Get paid instantly after completing your visits.' },
  { icon: HeartHandshake, title: 'Quality Care', desc: 'Focus on what you do best: helping patients.' },
];

export function MinimalHome() {
  const isProvider = process.env.NEXT_PUBLIC_APP_TARGET === 'provider';
  const config = APP_TARGET_CONFIG[isProvider ? 'provider' : 'patient'];
  const features = isProvider ? PROVIDER_FEATURES : PATIENT_FEATURES;

  return (
    <div className="pt-safe pb-safe flex min-h-[100svh] flex-col items-center bg-background w-full">
      <div className="flex-none pt-12 pb-8 flex flex-col items-center text-center px-8 w-full">
        <Image
          src="/mendyr.png"
          alt="Mendyr Logo"
          width={140}
          height={46}
          loading="eager"
          className="mb-6 h-10 w-auto object-contain"
        />
        <h1 className="text-foreground mb-3 font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-tight">
          {config.displayName}
        </h1>
        <p className="text-muted-foreground max-w-xs">{config.tagline}</p>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center min-h-0">
        <Carousel className="w-full">
          {features.map((feature, i) => (
            <CarouselItem key={i}>
              <Card className="h-full bg-card border-border/50 shadow-sm transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-outfit font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </Carousel>
      </div>

      <div className="w-full max-w-sm space-y-3 px-6 pb-12 mt-auto">
        <Link
          href={config.primaryCta.href}
          onClick={() => hapticTap()}
          className="from-primary to-primary/80 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {config.primaryCta.label}
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href={config.secondaryCta.href}
          onClick={() => hapticTap()}
          className="border-border text-foreground hover:bg-muted flex h-14 w-full items-center justify-center rounded-xl border-2 text-base font-semibold transition-all active:scale-[0.98]"
        >
          {config.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}
