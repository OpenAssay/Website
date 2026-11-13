"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number; z: number; size: number; warm: boolean; alpha: number };

export function ResearchField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const figure = useRef<HTMLElement>(null);
  const phase = useRef(.5);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotion(!query.matches);
    const change = () => setMotion(!query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    const container = figure.current;
    const context = element?.getContext("2d");
    if (!element || !container || !context) return;
    let seed = 4127;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const points: Point[] = [];
    for (let i = 0; i < 2200; i++) {
      const theta = random() * Math.PI * 2;
      const ring = Math.floor(random() * 9);
      const tilt = (ring / 9 - .5) * 2.6;
      const radius = .64 + random() * .28;
      const spread = (random() - .5) * .028;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      points.push({ x, y: y * Math.cos(tilt) + spread, z: y * Math.sin(tilt) + spread, size: random() < .965 ? .45 + random() * .5 : 1.2, warm: random() > .28, alpha: .3 + random() * .7 });
    }
    let width = 0, height = 0, frame = 0, lastTime = 0, time = phase.current, visible = true;
    let pointerX = 0, pointerY = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width * .49, height * .46);
      const angle = time * .065 + pointerX * .04;
      const tilt = -.38 + pointerY * .04;
      const projected = points.map(point => {
        const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
        const z = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
        const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = point.y * Math.sin(tilt) + z * Math.cos(tilt);
        const rotation = -.42;
        const perspective = 2.8 / (2.8 - depth * .32);
        return { ...point, px: (x * Math.cos(rotation) - y * Math.sin(rotation)) * scale * perspective + width / 2, py: (x * Math.sin(rotation) + y * Math.cos(rotation)) * scale * perspective + height / 2, depth };
      }).sort((a, b) => a.depth - b.depth);
      for (const p of projected) {
        const alpha = Math.max(.08, (.36 + p.depth * .32) * p.alpha);
        context.fillStyle = p.warm ? `rgba(255,${125 + Math.round(p.depth * 24)},64,${alpha})` : `rgba(216,221,199,${alpha * .65})`;
        context.beginPath(); context.arc(p.px, p.py, p.size * (1 + p.depth * .25), 0, Math.PI * 2); context.fill();
      }
    };
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const animate = (now: number) => {
      if (!motion || !visible || document.hidden) { frame = 0; return; }
      if (now - lastTime > 32) { time += .018; draw(); lastTime = now; }
      frame = requestAnimationFrame(animate);
    };
    const start = () => { if (motion && visible && !document.hidden && !frame) frame = requestAnimationFrame(animate); };
    const observer = new ResizeObserver(resize); observer.observe(container);
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; start(); }); visibility.observe(container);
    const onVisibility = () => start();
    const onPointer = (event: PointerEvent) => { const rect = container.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width - .5; pointerY = (event.clientY - rect.top) / rect.height - .5; };
    container.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    resize(); start();
    return () => { phase.current = time; cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); container.removeEventListener("pointermove", onPointer); document.removeEventListener("visibilitychange", onVisibility); };
  }, [motion]);

  return <figure className="research-field" ref={figure} aria-label="An abstract field of orange particles orbiting the OpenAssay symbol"><canvas ref={canvas} aria-hidden="true" /><div className="field-emblem" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><path d="M18 50h41L81 12M59 50l22 38" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg></div><span className="field-cross field-cross-one" aria-hidden="true">+</span><span className="field-cross field-cross-two" aria-hidden="true">+</span><figcaption className="field-caption">A FIELD OF POSSIBILITY</figcaption><button className="motion-toggle" onClick={() => setMotion(value => !value)} aria-pressed={motion} aria-label={motion ? "Pause decorative animation" : "Play decorative animation"}>{motion ? <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1v8M7.5 1v8" stroke="currentColor" strokeWidth="1.5" /></svg> : <svg viewBox="0 0 10 10" aria-hidden="true"><path d="m2 1 7 4-7 4z" fill="currentColor" /></svg>}{motion ? "Pause motion" : "Play motion"}</button></figure>;
}
