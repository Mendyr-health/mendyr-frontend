'use client';
import { cn } from '@mendyr/shared-utils';
import React from 'react';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group/bento bg-glass border-border row-span-1 flex flex-col justify-between space-y-4 rounded-xl border p-4 shadow-none transition duration-200 hover:shadow-xl',
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="font-outfit text-muted-foreground mt-2 mb-2 font-bold">{title}</div>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
    </div>
  );
}
