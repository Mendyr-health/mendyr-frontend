"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export function MovingBorder({
  children,
  duration = 3000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "relative inline-flex h-12 overflow-hidden p-[2px] focus:outline-none",
        containerClassName
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      <span
        className="absolute inset-[-1000%]"
        style={{
          animation: `spin ${duration}ms linear infinite`,
          background: `conic-gradient(from 0deg, transparent 0%, var(--color-primary) 25%, hsl(38 92% 50%) 50%, var(--color-primary) 75%, transparent 100%)`,
        }}
      />
      <span
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[calc(1.75rem-2px)] bg-background px-6 py-2 text-sm font-medium text-foreground backdrop-blur-3xl",
          className
        )}
      >
        {children}
      </span>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Component>
  );
}
