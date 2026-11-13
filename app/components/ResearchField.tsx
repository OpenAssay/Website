"use client";

import { useEffect, useRef } from "react";
import { createResearchAnimation } from "./research-animation";

export function ResearchField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const figure = useRef<HTMLElement>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const element = canvas.current;
    const container = figure.current;
    const context = element?.getContext("2d");
    if (!element || !container || !context) return;
    const draw = createResearchAnimation();
    let width = 0, height = 0, frame = 0;
    let previousTime: number | null = null;
    let lastPaint = -Infinity;
    let visible = false;
    let pointerX = 0, pointerY = 0;

    const paint = () => draw(context, width, height, elapsed.current, pointerX, pointerY);
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint();
    };
    const animate = (now: number) => {
      if (!visible || document.hidden) {
        frame = 0;
        previousTime = null;
        return;
      }
      if (previousTime !== null) elapsed.current += Math.min((now - previousTime) / 1000, .05);
      previousTime = now;
      if (now - lastPaint >= 1000 / 30) {
        paint();
        lastPaint = now;
      }
      frame = requestAnimationFrame(animate);
    };
    const start = () => {
      if (visible && !document.hidden && !frame) {
        previousTime = null;
        lastPaint = -Infinity;
        frame = requestAnimationFrame(animate);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    });
    visibility.observe(container);
    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    const onPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - .5;
      pointerY = (event.clientY - rect.top) / rect.height - .5;
    };
    container.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    container.dataset.ready = "true";

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      container.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      delete container.dataset.ready;
    };
  }, []);

  return (
    <figure className="research-field" ref={figure} aria-label="Three pieces assemble into the OpenAssay symbol, emitting orange and grey particles that settle into orbit">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="field-emblem" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none"><path d="M18 50h41L81 12M59 50l22 38" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </figure>
  );
}
