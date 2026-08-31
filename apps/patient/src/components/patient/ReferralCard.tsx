'use client';

import { useState } from 'react';
import { Gift, Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

const SHARE_MESSAGE = (code: string) =>
  `Join me on Mendyr for at-home healthcare — nurses, physiotherapy, and elder care, ` +
  `booked to your door. Use my referral code ${code} when you sign up.`;

export function ReferralCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user?.referralCode) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — select and copy the code manually.');
    }
  };

  const handleShare = async () => {
    const text = SHARE_MESSAGE(user.referralCode);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join me on Mendyr', text });
      } catch {
        // User cancelled the share sheet — not an error.
      }
      return;
    }
    // No Web Share API (most desktop browsers) — fall back to copying the shareable message.
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Referral message copied — paste it anywhere to share.');
    } catch {
      toast.error('Could not copy — select and copy the code manually.');
    }
  };

  return (
    <div className="bg-glass border-border max-w-2xl rounded-2xl border p-6">
      <div className="mb-4 flex items-center gap-3">
        <Gift className="h-5 w-5 text-emerald-400" />
        <h2 className="text-muted-foreground text-lg font-semibold">Refer & Earn</h2>
      </div>
      <p className="text-muted-foreground mb-4 text-sm">
        Share your code with friends and family — when they sign up, you both get rewarded.
      </p>
      <div className="border-border bg-muted/40 flex items-center justify-between rounded-xl border border-dashed px-4 py-3">
        <span className="text-foreground font-mono text-lg font-bold tracking-widest">
          {user.referralCode}
        </span>
        <button
          onClick={handleCopy}
          className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <button
        onClick={handleShare}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
      >
        <Share2 className="h-4 w-4" />
        Share with friends
      </button>
    </div>
  );
}
