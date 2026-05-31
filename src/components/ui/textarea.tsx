import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-sm text-foreground shadow-sm backdrop-blur-md transition-all placeholder:text-muted-foreground/70 focus:outline-none focus:bg-white/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive/60 aria-invalid:ring-destructive/20 dark:border-white/10 dark:bg-black/20 dark:focus:bg-black/30 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
