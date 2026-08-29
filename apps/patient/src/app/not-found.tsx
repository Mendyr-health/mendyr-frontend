'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md text-center"
      >
        {/* 404 text */}
        <div className="relative mb-8">
          <span className="font-outfit bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-[120px] leading-none font-black text-transparent select-none md:text-[160px]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/10 h-24 w-24 rounded-full blur-2xl" />
          </div>
        </div>

        <h1 className="font-outfit mb-3 text-2xl font-bold text-neutral-100 md:text-3xl">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="from-primary-dark to-primary hover:from-primary hover:to-primary-light flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 font-medium text-white transition-all"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-border text-muted-foreground hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border px-6 py-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
