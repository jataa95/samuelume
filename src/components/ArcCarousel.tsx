"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/content/site";

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Distance-to-transform for a card `d` steps from the centre of the arc. */
function place(d: number) {
  const a = Math.abs(d);
  const x = a === 0 ? 0 : Math.sign(d) * (0.97 + (a - 1) * 0.8);
  const y = d * d * 0.11;
  const scale = a === 0 ? 1 : 0.72 - Math.min(a - 1, 2) * 0.04;
  return {
    transform: `translate(calc(var(--w) * ${x}), calc(var(--w) * ${y})) rotate(${d * 7}deg) scale(${scale})`,
    opacity: a > 3 ? 0 : 1,
    zIndex: 10 - a,
    filter: a === 0 ? "none" : "saturate(0.85)",
  };
}

export function ArcCarousel({ works }: { works: Work[] }) {
  const router = useRouter();
  const n = works.length;
  // Repeat the list so the arc always has hidden cards to wrap round with.
  const copies = Math.max(1, Math.ceil(12 / n));
  const slots = Array.from({ length: n * copies }, (_, i) => works[i % n]);
  const L = slots.length;

  const [active, setActive] = useState(0);
  const current = works[mod(active, n)];
  const lock = useRef(0);
  const acc = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const step = useCallback((by: number) => {
    const now = performance.now();
    if (now < lock.current) return;
    lock.current = now + 520;
    setActive((a) => a + by);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      acc.current += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(acc.current) > 40) {
        step(Math.sign(acc.current));
        acc.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      if (e.key === "Enter" && document.activeElement === document.body) router.push(`/works/${works[mod(active, n)].slug}`);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [step, router, works, active, n]);

  return (
    <main
      className="home"
      onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
      onPointerMove={(e) => {
        const d = drag.current;
        if (d && Math.abs(e.clientX - d.x) > 40 && !d.moved) {
          d.moved = true;
          step(e.clientX < d.x ? 1 : -1);
        }
      }}
      onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
    >
      <div className="home__info">
        <div key={`l${current.slug}`} className="swap">
          <h1 className="home__title serif">{current.title}</h1>
          <p className="home__excerpt">{current.excerpt}</p>
          <p className="home__year">{[current.year, current.status].filter(Boolean).join(" · ")}</p>
        </div>
        <div key={`r${current.slug}`} className="swap">
          <p className="home__cat serif">{current.category}</p>
          <p className="home__count">
            {String(mod(active, n) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="arc" role="list">
        {slots.map((w, i) => {
          const d = mod(i - active + Math.floor(L / 2), L) - Math.floor(L / 2);
          const visible = Math.abs(d) <= 3;
          return (
            <button
              key={i}
              role="listitem"
              className="arc__item"
              style={place(d)}
              tabIndex={visible ? 0 : -1}
              aria-hidden={!visible}
              aria-label={d === 0 ? `Open ${w.title}` : `Show ${w.title}`}
              onClick={() => {
                if (drag.current?.moved) return;
                if (d === 0) router.push(`/works/${w.slug}`);
                else setActive((a) => a + d);
              }}
            >
              {w.image && <Image src={w.image.src} alt="" fill sizes="(max-width: 720px) 52vw, 300px" priority={Math.abs(d) <= 2} draggable={false} />}
            </button>
          );
        })}
      </div>

      <p className="home__hint">Scroll, drag or click to explore</p>
    </main>
  );
}
