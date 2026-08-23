"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Activity, Stethoscope, Wrench, AlertTriangle } from "lucide-react";
import { ThreeDCard } from "@/components/aceternity";
import { HEALTHCARE_SERVICES } from "@mendyr/shared-utils";

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  Stethoscope: <Stethoscope className="w-8 h-8" />,
  Wrench: <Wrench className="w-8 h-8" />,
  AlertTriangle: <AlertTriangle className="w-8 h-8" />,
};

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare solutions delivered by verified professionals to your doorstep.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HEALTHCARE_SERVICES.map((service, idx) => (
            <ThreeDCard key={service.slug}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="block group">
                  <div className="bg-glass rounded-2xl p-8 h-full hover:glow-primary transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      {iconMap[service.icon]}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {service.shortDesc}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-primary">
                        {service.pricingRange}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </ThreeDCard>
          ))}
        </div>
      </div>
    </div>
  );
}
