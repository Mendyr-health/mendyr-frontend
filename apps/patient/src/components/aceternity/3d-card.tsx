'use client';
import { cn } from '@mendyr/shared-utils';
import { motion } from 'framer-motion';
import React, { createContext, useContext, useState } from 'react';

const MouseEnterContext = createContext<{
  isMouseEntered: boolean;
  setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isMouseEntered: false, setIsMouseEntered: () => {} });

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transition = 'all 0.5s ease';
      containerRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  };

  return (
    <MouseEnterContext.Provider value={{ isMouseEntered, setIsMouseEntered }}>
      <div
        className={cn('flex items-center justify-center', containerClassName)}
        style={{ perspective: '1000px' }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'relative flex items-center justify-center transition-all duration-200 ease-linear',
            className,
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardItem({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) {
  const { isMouseEntered } = useContext(MouseEnterContext);

  return (
    <Tag
      className={cn('w-fit transition duration-200 ease-linear', className)}
      style={{
        transform: isMouseEntered
          ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
          : 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
