"use client";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-[100svh] bg-background">
        <div className="min-h-[100svh] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
              Something Went Wrong
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>

            {error.digest && (
              <p className="text-xs text-neutral-600 mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-dark to-primary text-white font-medium hover:from-primary hover:to-primary-light transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all"
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
