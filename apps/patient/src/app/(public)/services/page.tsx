'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Users,
  Activity,
  Stethoscope,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { ThreeDCard } from '@/components/aceternity';
import { HEALTHCARE_SERVICES } from '@mendyr/shared-utils';

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Activity: <Activity className="h-8 w-8" />,
  Stethoscope: <Stethoscope className="h-8 w-8" />,
  Wrench: <Wrench className="h-8 w-8" />,
  AlertTriangle: <AlertTriangle className="h-8 w-8" />,
};

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-foreground mb-4 font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Comprehensive healthcare solutions delivered by verified professionals to your doorstep.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {HEALTHCARE_SERVICES.map((service, idx) => (
            <ThreeDCard key={service.slug}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="group block">
                  <div className="bg-glass hover:glow-primary h-full rounded-2xl p-8 transition-all duration-300">
                    <div className="bg-gradient-primary/10 text-primary mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                      {iconMap[service.icon]}
                    </div>
                    <h3 className="text-foreground mb-3 text-xl font-bold">{service.name}</h3>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      {service.shortDesc}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {service.features.slice(0, 3).map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="text-muted-foreground flex items-center gap-2 text-xs"
                        >
                          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="border-border flex items-center justify-between border-t pt-4">
                      <span className="text-primary text-sm font-semibold">
                        {service.pricingRange}
                      </span>
                      <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1 text-sm transition-colors">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
