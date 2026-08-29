'use client';
import { cn } from '@mendyr/shared-utils';
import { useEffect, useRef, useState } from 'react';

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'slow',
  pauseOnHover = true,
  className,
}: {
  items: any[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });

    const speedMap = { fast: '20s', normal: '40s', slow: '80s' };
    containerRef.current.style.setProperty('--animation-duration', speedMap[speed]);
    containerRef.current.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse',
    );
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item, idx) => (
          <li
            className="bg-glass-strong relative w-[200px] max-w-full flex-shrink-0 rounded-full border border-white/60 px-6 py-4 shadow-sm md:w-[250px]"
            key={(item.text || item.name || '') + idx}
          >
            <div className="relative z-20 flex items-center gap-3">
              {item.icon && <div className="text-primary">{item.icon}</div>}
              {item.text && (
                <span className="text-foreground text-sm font-medium whitespace-nowrap">
                  {item.text}
                </span>
              )}
              {item.quote && (
                <blockquote>
                  <span className="text-muted-foreground relative z-20 text-sm leading-relaxed">
                    {item.quote}
                  </span>
                  <div className="relative z-20 mt-6 flex flex-row items-center">
                    <span className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm font-medium">{item.name}</span>
                      <span className="text-muted-foreground text-xs">{item.title}</span>
                    </span>
                  </div>
                </blockquote>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards)
            linear infinite;
        }
      `}</style>
    </div>
  );
}
