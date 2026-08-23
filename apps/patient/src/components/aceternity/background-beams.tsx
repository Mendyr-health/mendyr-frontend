"use client";
import { cn } from "@mendyr/shared-utils";
import { useEffect, useRef } from "react";

export function BackgroundBeams({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const beams = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      speed: 0.3 + Math.random() * 0.5,
      width: 1 + Math.random() * 2,
      hue: 168 + i * 8,
      offset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      time += 0.005;

      for (const beam of beams) {
        const x = beam.x + Math.sin(time * beam.speed + beam.offset) * 100;
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.offsetHeight);
        gradient.addColorStop(0, `hsla(${beam.hue}, 80%, 40%, 0)`);
        gradient.addColorStop(0.3, `hsla(${beam.hue}, 80%, 40%, 0.06)`);
        gradient.addColorStop(0.5, `hsla(${beam.hue}, 80%, 40%, 0.12)`);
        gradient.addColorStop(0.7, `hsla(${beam.hue}, 80%, 40%, 0.06)`);
        gradient.addColorStop(1, `hsla(${beam.hue}, 80%, 40%, 0)`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.moveTo(x, 0);

        // Bezier curve for organic movement
        const cp1x = x + Math.sin(time * 0.7 + beam.offset) * 50;
        const cp1y = canvas.offsetHeight * 0.33;
        const cp2x = x - Math.sin(time * 0.5 + beam.offset) * 50;
        const cp2y = canvas.offsetHeight * 0.66;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x + Math.sin(time + beam.offset) * 30, canvas.offsetHeight);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
