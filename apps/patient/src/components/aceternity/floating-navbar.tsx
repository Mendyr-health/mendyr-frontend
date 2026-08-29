"use client";
import { cn } from "@mendyr/shared-utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export function FloatingNav({
  navItems,
  className,
}: {
  navItems: { label: string; href: string; icon?: React.ReactNode }[];
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-border rounded-full bg-muted backdrop-blur-xl shadow-[0_0_30px_rgba(13,148,136,0.1)] z-[5000] pr-2 pl-6 py-2 items-center justify-center gap-4",
          className
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative text-muted-foreground hover:text-foreground text-sm transition-colors px-2"
          >
            <span className="hidden sm:inline">{item.label}</span>
            {item.icon && <span className="sm:hidden">{item.icon}</span>}
          </Link>
        ))}
        <Link
          href="/login"
          className="relative rounded-full bg-gradient-to-r from-primary-dark to-primary hover:from-primary hover:to-primary-light text-white text-sm px-5 py-2 font-medium transition-all"
        >
          Login
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
