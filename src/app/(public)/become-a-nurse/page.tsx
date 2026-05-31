"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, DollarSign, Shield, Heart, Star } from "lucide-react";
import { LampEffect, MovingBorder, BentoGrid, BentoGridItem } from "@/components/aceternity";

export default function BecomeANursePage() {
  const benefits = [
    { title: "Flexible Schedule", description: "Set your own working hours and availability. Work when it suits you best.", icon: <Clock className="w-5 h-5 text-primary" /> },
    { title: "Competitive Pay", description: "Earn above-market rates for your expertise. Transparent payout with no hidden deductions.", icon: <DollarSign className="w-5 h-5 text-primary" /> },
    { title: "Verified Platform", description: "Join a trusted platform that values and verifies every healthcare professional.", icon: <Shield className="w-5 h-5 text-primary" /> },
    { title: "Meaningful Work", description: "Make a real difference in patients' lives by delivering care right to their homes.", icon: <Heart className="w-5 h-5 text-primary" /> },
    { title: "Professional Growth", description: "Access training resources, certifications, and a community of healthcare peers.", icon: <Star className="w-5 h-5 text-primary" />, className: "md:col-span-2" },
  ];

  const requirements = [
    "Valid nursing degree or healthcare certification",
    "Minimum 1 year of professional experience",
    "Government-issued ID (Aadhaar card)",
    "Clean background check",
    "Willingness to undergo verification",
    "Compassion and dedication to patient care",
  ];

  return (
    <div className="pt-24">
      <LampEffect className="py-20">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4">
            Join the <span className="text-gradient">Mendyr</span> Team
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Empower yourself as a healthcare professional. Set your schedule, earn well, and transform lives from the comfort of patients&apos; homes.
          </p>
          <MovingBorder as="div" containerClassName="inline-block cursor-pointer" duration={4000}>
            <Link href="/register/nurse" className="flex items-center gap-2 text-lg font-semibold text-foreground px-4 py-1">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
          </MovingBorder>
        </div>
      </LampEffect>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-outfit)] mb-12">
            Why Nurses Love <span className="text-gradient">Mendyr</span>
          </h2>
          <BentoGrid>
            {benefits.map((b, idx) => (
              <BentoGridItem key={idx} title={b.title} description={b.description} icon={b.icon} className={b.className} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-outfit)] mb-12">Requirements</h2>
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
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register/nurse"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Start Your Application <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
