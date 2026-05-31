import type { Metadata } from "next";
import { Heart, Target, Eye, Users } from "lucide-react";
import { LampEffect, BentoGrid, BentoGridItem } from "@/components/aceternity";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Mendyr's mission to transform home healthcare in India through technology, trust, and compassion.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <LampEffect className="py-20">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4">
            About <span className="text-gradient">Mendyr</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We&apos;re on a mission to make quality healthcare accessible to everyone,
            right in the comfort of their homes.
          </p>
        </div>
      </LampEffect>

      {/* Mission / Vision / Values */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            <BentoGridItem
              title="Our Mission"
              description="To bridge the gap between patients and quality healthcare by providing a trusted platform that connects families with verified, compassionate healthcare professionals for at-home care."
              icon={<Target className="w-5 h-5 text-primary" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Our Vision"
              description="A world where every person has access to professional healthcare services without leaving their home. We envision a future where home-based care is the standard, not the exception."
              icon={<Eye className="w-5 h-5 text-primary" />}
            />
            <BentoGridItem
              title="Our Values"
              description="Trust, transparency, compassion, and excellence guide everything we do. We believe in putting patients first while empowering healthcare professionals to do their best work."
              icon={<Heart className="w-5 h-5 text-primary" />}
            />
            <BentoGridItem
              title="Our Team"
              description="Mendyr is built by a passionate team of healthcare professionals, technologists, and entrepreneurs who share a common goal — making healthcare more human and accessible."
              icon={<Users className="w-5 h-5 text-primary" />}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </section>
    </div>
  );
}
