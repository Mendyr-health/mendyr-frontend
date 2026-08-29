import type { Metadata } from 'next';
import { Heart, Target, Eye, Users } from 'lucide-react';
import { LampEffect, BentoGrid, BentoGridItem } from '@/components/aceternity';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Learn about Mendyr's mission to transform home healthcare in India through technology, trust, and compassion.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <LampEffect className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-foreground mb-4 font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            About <span className="text-gradient">Mendyr</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We&apos;re on a mission to make quality healthcare accessible to everyone, right in the
            comfort of their homes.
          </p>
        </div>
      </LampEffect>

      {/* Mission / Vision / Values */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <BentoGrid>
            <BentoGridItem
              title="Our Mission"
              description="To bridge the gap between patients and quality healthcare by providing a trusted platform that connects families with verified, compassionate healthcare professionals for at-home care."
              icon={<Target className="text-primary h-5 w-5" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Our Vision"
              description="A world where every person has access to professional healthcare services without leaving their home. We envision a future where home-based care is the standard, not the exception."
              icon={<Eye className="text-primary h-5 w-5" />}
            />
            <BentoGridItem
              title="Our Values"
              description="Trust, transparency, compassion, and excellence guide everything we do. We believe in putting patients first while empowering healthcare professionals to do their best work."
              icon={<Heart className="text-primary h-5 w-5" />}
            />
            <BentoGridItem
              title="Our Team"
              description="Mendyr is built by a passionate team of healthcare professionals, technologists, and entrepreneurs who share a common goal — making healthcare more human and accessible."
              icon={<Users className="text-primary h-5 w-5" />}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </section>
    </div>
  );
}
