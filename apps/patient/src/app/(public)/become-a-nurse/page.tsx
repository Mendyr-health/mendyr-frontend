'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, DollarSign, Shield, Heart, Star } from 'lucide-react';
import { LampEffect, MovingBorder, BentoGrid, BentoGridItem } from '@/components/aceternity';

export default function BecomeANursePage() {
  const benefits = [
    {
      title: 'Flexible Schedule',
      description: 'Set your own working hours and availability. Work when it suits you best.',
      icon: <Clock className="text-primary h-5 w-5" />,
    },
    {
      title: 'Competitive Pay',
      description:
        'Earn above-market rates for your expertise. Transparent payout with no hidden deductions.',
      icon: <DollarSign className="text-primary h-5 w-5" />,
    },
    {
      title: 'Verified Platform',
      description:
        'Join a trusted platform that values and verifies every healthcare professional.',
      icon: <Shield className="text-primary h-5 w-5" />,
    },
    {
      title: 'Meaningful Work',
      description:
        "Make a real difference in patients' lives by delivering care right to their homes.",
      icon: <Heart className="text-primary h-5 w-5" />,
    },
    {
      title: 'Professional Growth',
      description:
        'Access training resources, certifications, and a community of healthcare peers.',
      icon: <Star className="text-primary h-5 w-5" />,
      className: 'md:col-span-2',
    },
  ];

  const requirements = [
    'Valid nursing degree or healthcare certification',
    'Minimum 1 year of professional experience',
    'Government-issued ID (Aadhaar card)',
    'Clean background check',
    'Willingness to undergo verification',
    'Compassion and dedication to patient care',
  ];

  return (
    <div className="pt-24">
      <LampEffect className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-foreground mb-4 font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Join the <span className="text-gradient">Mendyr</span> Team
          </h1>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Empower yourself as a healthcare professional. Set your schedule, earn well, and
            transform lives from the comfort of patients&apos; homes.
          </p>
          <MovingBorder as="div" containerClassName="inline-block cursor-pointer" duration={4000}>
            <Link
              href="/register/nurse"
              className="text-foreground flex items-center gap-2 px-4 py-1 text-lg font-semibold"
            >
              Apply Now <ArrowRight className="h-5 w-5" />
            </Link>
          </MovingBorder>
        </div>
      </LampEffect>

      {/* Benefits */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-foreground mb-12 text-center font-[family-name:var(--font-outfit)] text-3xl font-bold">
            Why Nurses Love <span className="text-gradient">Mendyr</span>
          </h2>
          <BentoGrid>
            {benefits.map((b, idx) => (
              <BentoGridItem
                key={idx}
                title={b.title}
                description={b.description}
                icon={b.icon}
                className={b.className}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-foreground mb-12 text-center font-[family-name:var(--font-outfit)] text-3xl font-bold">
            Requirements
          </h2>
          <div className="bg-glass rounded-2xl p-8">
            <ul className="space-y-4">
              {requirements.map((req, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register/nurse"
              className="bg-gradient-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start Your Application <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
