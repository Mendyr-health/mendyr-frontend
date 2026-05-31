"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Spotlight effect — cursor-following gradient glow behind content.
 * Used for hero sections.
 */
export function Spotlight({
  className,
  fill = "white",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[169%] w-[138%] animate-spotlight opacity-0 lg:w-[84%]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * TextGenerateEffect — text that animates in word by word.
 */
export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="leading-snug tracking-tight">
          {wordsArray.map((word, idx) => (
            <motion.span
              key={word + idx}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
              className="inline-block mr-1.5"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * BackgroundBeams — animated beam lines for backgrounds.
 */
export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line
            key={i}
            x1={100 + i * 120}
            y1="0"
            x2={50 + i * 100}
            y2="900"
            stroke="url(#beam-gradient)"
            strokeWidth="1"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        ))}
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * MovingBorder — animated gradient border around a button or card.
 */
export function MovingBorder({
  children,
  duration = 3000,
  className,
  containerClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-xl p-[1px] bg-transparent",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(var(--angle, 0deg), var(--color-primary), var(--color-accent), var(--color-primary))",
          animation: `spin ${duration}ms linear infinite`,
        }}
      />
      <div
        className={cn(
          "relative rounded-xl bg-hsl-background px-6 py-3",
          "bg-background",
          className
        )}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </Component>
  );
}

/**
 * BentoGrid — masonry-like grid for feature cards.
 */
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
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
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
  icon,
  header,
}: {
  className?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200",
        "bg-glass p-6 flex flex-col justify-between space-y-4",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {header}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="font-semibold text-lg text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

/**
 * Sparkles — small animated particle dots.
 */
const SPARKLES_COUNT = 30;

function createSparkleConfig(index: number) {
  let seed = (index + 1) * 0x9e3779b1;

  const random = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  return {
    left: `${(random() * 100).toFixed(3)}%`,
    top: `${(random() * 100).toFixed(3)}%`,
    duration: 2 + random() * 2,
    delay: random() * 3,
    repeatDelay: random() * 4,
  };
}

const SPARKLES = Array.from({ length: SPARKLES_COUNT }, (_, index) =>
  createSparkleConfig(index),
);

export function SparklesBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0">
        {SPARKLES.map((sparkle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              left: sparkle.left,
              top: sparkle.top,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              repeatDelay: sparkle.repeatDelay,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * 3D Card — tilt-on-hover card with depth effect.
 */
const CardContext = React.createContext<{
  rotateX: number;
  rotateY: number;
}>({ rotateX: 0, rotateY: 0 });

export function ThreeDCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = -(e.clientX - rect.left - rect.width / 2) / 20;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <CardContext.Provider value={{ rotateX: rotate.x, rotateY: rotate.y }}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("relative group/card", className)}
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          animate={{
            rotateX: rotate.x,
            rotateY: rotate.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </motion.div>
      </div>
    </CardContext.Provider>
  );
}

/**
 * FloatingNavbar — navbar that appears/hides on scroll.
 */
export function FloatingNavbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-6 inset-x-0 mx-auto max-w-5xl z-50",
        "bg-glass-strong rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(5,17,242,0.12)] border-white/60",
        className
      )}
    >
      {children}
    </motion.nav>
  );
}

/**
 * LampEffect — animated glow/lamp effect for section dividers.
 */
export function LampEffect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Lamp glow */}
      <motion.div
        initial={{ width: "8rem" }}
        whileInView={{ width: "24rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 h-48 bg-gradient-to-b from-primary to-transparent opacity-30 blur-3xl"
      />
      <motion.div
        initial={{ width: "16rem" }}
        whileInView={{ width: "40rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
        className="absolute top-0 h-32 bg-gradient-to-b from-primary-light to-transparent opacity-20 blur-2xl"
      />
      {/* Lamp line */}
      <motion.div
        initial={{ width: "8rem" }}
        whileInView={{ width: "20rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * InfiniteMovingCards — auto-scrolling horizontal cards for trust badges.
 */
export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  className,
}: {
  items: { text: string; icon?: React.ReactNode }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const speedMap = { fast: "20s", normal: "40s", slow: "60s" };

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}
    >
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: direction === "left" ? [0, -1920] : [-1920, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: parseInt(speedMap[speed]),
            ease: "linear",
          },
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-glass whitespace-nowrap text-sm text-foreground"
          >
            {item.icon}
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
