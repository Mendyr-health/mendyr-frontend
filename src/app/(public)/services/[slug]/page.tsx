import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { HEALTHCARE_SERVICES } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HEALTHCARE_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = HEALTHCARE_SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.name,
    description: service.shortDesc,
    openGraph: { title: service.name, description: service.shortDesc },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = HEALTHCARE_SERVICES.find((s) => s.slug === slug);

  if (!service) notFound();

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="bg-glass rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-4">
            {service.name}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {service.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sidebar rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Pricing</h2>
              <p className="text-2xl font-bold text-gradient mb-4">{service.pricingRange}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Final pricing depends on service duration, complexity, and specific requirements.
              </p>
              <Link
                href="/register/patient"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
              >
                Register to Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
