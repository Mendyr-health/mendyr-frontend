'use client';
import { cn } from '@mendyr/shared-utils';
import { motion } from 'framer-motion';

export function TextGenerateEffect({
  words,
  className,
  speed = 0.04,
}: {
  words: string;
  className?: string;
  speed?: number;
}) {
  const wordsArray = words.split(' ');

  return (
    <div className={cn('font-bold', className)}>
      <div className="leading-snug tracking-tight">
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: idx * speed }}
            className="mr-[0.3em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
