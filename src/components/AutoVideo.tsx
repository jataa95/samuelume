"use client";

import { useEffect, useRef } from "react";

/** Muted looping video that only loads and plays while it is on screen. */
export function AutoVideo({ name, className, label }: { name: string; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={`/video/${name}.mp4`}
      poster={`/video/${name}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
