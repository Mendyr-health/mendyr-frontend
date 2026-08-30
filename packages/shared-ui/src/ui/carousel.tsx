import * as React from 'react';
import { cn } from '@mendyr/shared-utils';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Carousel({ children, className, ...props }: CarouselProps) {
  return (
    <div
      className={cn(
        'flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-4 md:px-0',
        'scrollbar-hide -mx-4 md:mx-0',
        className,
      )}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
      {children}
    </div>
  );
}

export function CarouselItem({ children, className, ...props }: CarouselProps) {
  return (
    <div
      className={cn('w-[85%] shrink-0 snap-center md:w-[45%] md:snap-start lg:w-[30%]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
