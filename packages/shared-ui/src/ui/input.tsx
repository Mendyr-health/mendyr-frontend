import * as React from "react";
import { cn } from "@mendyr/shared-utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/80 bg-card/95 px-4 py-2 text-sm text-foreground shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive/60 aria-invalid:ring-destructive/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
