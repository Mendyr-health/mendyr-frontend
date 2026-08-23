"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Users, Activity, Stethoscope, Wrench, AlertTriangle,
  ShieldCheck, Eye, DollarSign, Home, Phone,
  ArrowRight, CheckCircle, ChevronDown, ChevronUp, Send,
  UserPlus, Bell, CalendarCheck, Star,
} from "lucide-react";
import {
  Spotlight,
  TextGenerateEffect,
  BackgroundBeams,
  MovingBorder,
  BentoGrid,
  BentoGridItem,
  SparklesBackground,
  ThreeDCard,
  LampEffect,
  InfiniteMovingCards,
} from "@/components/aceternity";
import { HEALTHCARE_SERVICES, FAQ_ITEMS } from "@mendyr/shared-utils";

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
};

// ─── Hero Section ────────────────────────────────

function HeroSection() {
  return (
    <section className="
      relative
      min-h-[100svh]
      flex
      items-center
      justify-center
      overflow-hidden
      pt-24
      pb-12">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--color-primary)" />
      <BackgroundBeams />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass text-sm text-primary mb-8"
        >
          <Star className="w-2 h-2 lg:w-4 lg:h-4" />
          <span>Launching Soon — Join the Waitlist</span>
        </motion.div>

        <TextGenerateEffect
          words="Healthcare That Comes Home to You"
          className="mx-auto
            max-w-4xl
            text-[clamp(2rem,8vw,5rem)]
            font-bold
            leading-[1.05]
            tracking-tight
            text-foreground
            font-[family-name:var(--font-outfit)]
          "
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6
            text-base
            sm:text-lg
            md:text-xl
            text-muted-foreground
            max-w-2xl
            mx-auto
            leading-relaxed
            px-2
          "
        >
          Mendyr connects you with verified nurses and caregivers for professional
          healthcare services delivered right to your doorstep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register/patient"
            className="group
              flex
              items-center
              justify-center
              gap-2
              w-full
              sm:w-auto
              min-w-[220px]
              px-6
              py-4
              rounded-xl
              bg-gradient-primary
              text-white
              font-semibold
              text-base
              sm:text-lg
              hover:opacity-90
              transition-all
              "
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <MovingBorder as="div" containerClassName="cursor-pointer">
            <Link href="/become-a-nurse" className="flex items-center gap-2 w-full sm:w-auto text-lg font-semibold text-foreground px-4 py-1">
              Become a Nurse
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MovingBorder>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16"
        >
          <InfiniteMovingCards
            speed="slow"
            items={[
              { text: "Verified Nurses", icon: <ShieldCheck className="w-4 h-4 text-primary" /> },
              { text: "Background Checked", icon: <Eye className="w-4 h-4 text-primary" /> },
              { text: "Transparent Pricing", icon: <DollarSign className="w-4 h-4 text-primary" /> },
              { text: "Home-Based Care", icon: <Home className="w-4 h-4 text-primary" /> },
              { text: "Emergency Support", icon: <Phone className="w-4 h-4 text-primary" /> },
              { text: "24/7 Availability", icon: <CheckCircle className="w-4 h-4 text-primary" /> },
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services Section ────────────────────────────

function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare services delivered to your home by verified professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTHCARE_SERVICES.map((service, idx) => (
            <ThreeDCard key={service.slug}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="bg-glass rounded-2xl p-6 h-full hover:border-primary/30 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      {iconMap[service.icon]}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.shortDesc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary font-medium">
                        {service.pricingRange}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </ThreeDCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Mendyr Section ──────────────────────────

function WhyMendyrSection() {
  const features = [
    { title: "Verified & Vetted Nurses", description: "Every nurse undergoes thorough background checks, credential verification, and skill assessment.", icon: <ShieldCheck className="w-5 h-5 text-primary" /> },
    { title: "Background Checks", description: "Comprehensive Aadhaar verification, criminal record checks, and reference validation for your safety.", icon: <Eye className="w-5 h-5 text-primary" /> },
    { title: "Transparent Pricing", description: "No hidden charges. Clear pricing for every service with upfront cost estimates before booking.", icon: <DollarSign className="w-5 h-5 text-primary" /> },
    { title: "Home-Based Care", description: "Professional healthcare in the comfort of your home. No hospital visits, no waiting rooms.", icon: <Home className="w-5 h-5 text-primary" /> },
    { title: "Emergency Support", description: "24/7 emergency assistance with rapid response teams ready to provide critical care when needed.", icon: <Phone className="w-5 h-5 text-primary" />, className: "md:col-span-2" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
            Why <span className="text-gradient">Mendyr</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We&apos;re building the most trusted home healthcare platform in India.
          </p>
        </motion.div>

        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoGridItem
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

// ─── How It Works Section ────────────────────────

function HowItWorksSection() {
  const steps = [
    { title: "Register", description: "Create your free account as a patient or nurse in minutes.", icon: <UserPlus className="w-6 h-6" /> },
    { title: "Join Waitlist", description: "Get on our waitlist to be notified when services launch in your area.", icon: <Bell className="w-6 h-6" /> },
    { title: "Get Notified", description: "We'll notify you as soon as Mendyr launches and services are available.", icon: <Send className="w-6 h-6" /> },
    { title: "Book Services", description: "Browse verified healthcare professionals and book services at your convenience.", icon: <CalendarCheck className="w-6 h-6" /> },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
            How It <span className="text-gradient">Works</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative flex items-center gap-8 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step number */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm z-10">
                  {idx + 1}
                </div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="bg-glass rounded-xl p-6">
                    <div className={`flex items-center gap-3 mb-2 ${idx % 2 === 0 ? "md:justify-end" : ""}`}>
                      <div className="text-primary">{step.icon}</div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Nurse CTA Section ───────────────────────────

function NurseCTASection() {
  return (
    <LampEffect className="py-24">
      <div className="text-center max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4"
        >
          Are You a <span className="text-gradient">Healthcare Professional</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          Join Mendyr&apos;s network of verified nurses and caregivers. Set your own schedule,
          earn competitive pay, and make a difference in patients&apos; lives.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <MovingBorder as="div" containerClassName="inline-block cursor-pointer" duration={4000}>
            <Link
              href="/register/nurse"
              className="flex items-center gap-2 text-lg font-semibold text-foreground px-4 py-1"
            >
              Apply as a Nurse
              <ArrowRight className="w-5 h-5" />
            </Link>
          </MovingBorder>
        </motion.div>
      </div>
    </LampEffect>
  );
}

// ─── FAQ Section ─────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                aria-expanded={openIndex === idx}
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === idx ? "auto" : 0,
                  opacity: openIndex === idx ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist CTA Section ────────────────────────

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" }),
      });
      setSubmitted(true);
    } catch {
      // Silently fail for MVP
    }
  };

  return (
    <SparklesBackground className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4"
        >
          Be the First to <span className="text-gradient">Know</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Join our waitlist and get notified when Mendyr launches in your area.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 text-success"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">You&apos;re on the list! We&apos;ll be in touch.</span>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 rounded-xl bg-glass text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
            >
              <Send className="w-4 h-4" />
              Join Waitlist
            </button>
          </motion.form>
        )}
      </div>
    </SparklesBackground>
  );
}

// ─── Main Landing Page ───────────────────────────

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyMendyrSection />
      <HowItWorksSection />
      <NurseCTASection />
      <FAQSection />
      <WaitlistSection />
    </>
  );
}
