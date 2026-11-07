"use client";
// SecondLane · Dot field · guidelines v0.1
// The brand texture: a 9px grid of yellow dots on green that swell near the pointer.
// Decorative only. Draws while on screen; static under reduced motion and on touch devices.
import { useEffect, useRef } from "react";
import { cx } from "./cx";

const CELL = 9;
const RADIUS = 1.05;
const REACH = 220;
const GROUND = "#12301F"; // green-900
const DOT = "227,253,90"; // yellow-300

export function DotField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!cv || !host || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches;
    const m = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, a: 0, ta: 0 };
    let w = 0, h = 0, raf = 0, visible = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = w * d; cv.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.fillStyle = GROUND;
      ctx.fillRect(0, 0, w, h);
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.a += (m.ta - m.a) * (m.ta > m.a ? 0.08 : 0.03);
      for (let y = CELL / 2; y < h; y += CELL) {
        for (let x = CELL / 2; x < w; x += CELL) {
          let f = 0;
          if (m.a > 0.01) {
            f = Math.max(0, 1 - Math.hypot(x - m.x, y - m.y) / REACH);
            f = f * f * (3 - 2 * f) * m.a;
          }
          ctx.fillStyle = `rgba(${DOT},${0.22 + 0.5 * f})`;
          ctx.beginPath();
          ctx.arc(x, y, RADIUS * (1 + f), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      m.tx = e.clientX - r.left; m.ty = e.clientY - r.top;
      if (m.x < -9e3) { m.x = m.tx; m.y = m.ty; }
      m.ta = 1;
    };
    const leave = () => { m.ta = 0; };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();
    if (still) return () => ro.disconnect();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    const loop = () => {
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cx("pointer-events-none absolute inset-0 size-full", className)} />;
}
