'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background min-h-[100svh]">
        <div className="flex min-h-[100svh] items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            <h1
              className="mb-3 text-2xl font-bold text-neutral-100 md:text-3xl"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Something Went Wrong
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>

            {error.digest && (
              <p className="mb-6 font-mono text-xs text-neutral-600">Error ID: {error.digest}</p>
            )}

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={reset}
                className="from-primary-dark to-primary hover:from-primary hover:to-primary-light flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 font-medium text-white transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="border-border text-muted-foreground hover:bg-muted flex items-center gap-2 rounded-xl border px-6 py-3 transition-all"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
