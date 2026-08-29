import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { HEALTHCARE_SERVICES } from '@mendyr/shared-utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HEALTHCARE_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = HEALTHCARE_SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: 'Service Not Found' };
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
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/services"
          className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="bg-glass rounded-2xl p-8 md:p-12">
          <h1 className="text-foreground mb-4 font-[family-name:var(--font-outfit)] text-3xl font-bold md:text-4xl">
            {service.name}
          </h1>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            {service.description}
          </p>

          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sidebar rounded-xl p-6">
              <h2 className="text-foreground mb-2 text-xl font-semibold">Pricing</h2>
              <p className="text-gradient mb-4 text-2xl font-bold">{service.pricingRange}</p>
              <p className="text-muted-foreground mb-6 text-sm">
                Final pricing depends on service duration, complexity, and specific requirements.
              </p>
              <Link
                href="/register/patient"
                className="bg-gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Register to Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
