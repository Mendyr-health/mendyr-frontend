import * as React from 'react';

import { cn } from '@mendyr/shared-utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-border/80 bg-card/95 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-primary/20 aria-invalid:border-destructive/60 aria-invalid:ring-destructive/20 flex field-sizing-content min-h-20 w-full rounded-xl border px-4 py-3 text-sm shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all focus:bg-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
