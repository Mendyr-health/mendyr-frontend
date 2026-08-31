'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, IndianRupee, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { useMyServices, type MyService } from '@/features/nurse/useMyServices';

function ServiceRow({
  service,
  saving,
  onSave,
}: {
  service: MyService;
  saving: boolean;
  onSave: (isOptedIn: boolean, priceOverride: number | null) => Promise<unknown>;
}) {
  const [priceInput, setPriceInput] = useState(
    service.priceOverride !== null ? String(service.priceOverride) : '',
  );

  const handleToggle = async () => {
    if (service.isOptedIn) {
      await onSave(false, service.priceOverride);
    } else {
      await onSave(true, service.priceOverride);
    }
  };

  const handleSavePrice = async () => {
    const parsed = priceInput.trim() === '' ? null : Number(priceInput);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) {
      toast.error('Enter a valid price, or leave it blank to charge the standard rate.');
      return;
    }
    await onSave(true, parsed);
    toast.success(`Price updated for ${service.serviceName}.`);
  };

  return (
    <div className="border-border/50 flex flex-col gap-4 border-b py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{service.categoryName}</p>
        <p className="text-foreground font-medium">{service.serviceName}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Standard rate: ₹{service.basePrice.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors disabled:opacity-50 ${
            service.isOptedIn
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {service.isOptedIn && <Check className="h-3.5 w-3.5" />}
          {service.isOptedIn ? 'Offering this' : 'Not offered'}
        </button>

        <div className="relative w-32">
          <IndianRupee className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            type="number"
            min={0}
            placeholder={String(service.basePrice)}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="h-9 pl-7 text-sm"
          />
        </div>

        <Button size="sm" className="h-9" onClick={handleSavePrice} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default function WebNurseServices() {
  const { services, loading, error, savingId, updateService } = useMyServices();

  return (
    <div className="space-y-6 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground font-outfit text-2xl font-bold">My Services</h1>
        <p className="text-muted-foreground mt-1">
          Choose which services you offer and set your own price for each one. Leave the price blank
          to charge the platform&apos;s standard rate.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="bg-glass border-border/50 max-w-3xl rounded-2xl border p-6">
        {loading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your services...
          </div>
        ) : services.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-sm">
            <Stethoscope className="h-8 w-8 opacity-40" />
            No services in the catalogue match your specialization yet.
          </div>
        ) : (
          services.map((service) => (
            <ServiceRow
              key={service.serviceId}
              service={service}
              saving={savingId === service.serviceId}
              onSave={(isOptedIn, priceOverride) =>
                updateService(service.serviceId, { isOptedIn, priceOverride })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
