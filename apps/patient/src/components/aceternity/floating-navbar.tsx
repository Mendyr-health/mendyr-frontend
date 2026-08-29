'use client';
import { cn } from '@mendyr/shared-utils';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export function FloatingNav({
  navItems,
  className,
}: {
  navItems: { label: string; href: string; icon?: React.ReactNode }[];
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
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
          'border-border bg-muted fixed inset-x-0 top-6 z-[5000] mx-auto flex max-w-fit items-center justify-center gap-4 rounded-full border py-2 pr-2 pl-6 shadow-[0_0_30px_rgba(13,148,136,0.1)] backdrop-blur-xl',
          className,
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:text-foreground relative px-2 text-sm transition-colors"
          >
            <span className="hidden sm:inline">{item.label}</span>
            {item.icon && <span className="sm:hidden">{item.icon}</span>}
          </Link>
        ))}
        <Link
          href="/login"
          className="from-primary-dark to-primary hover:from-primary hover:to-primary-light relative rounded-full bg-gradient-to-r px-5 py-2 text-sm font-medium text-white transition-all"
        >
          Login
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
