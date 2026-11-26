"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Work } from "@/content/site";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const AUTO_MS = 5000; // time each piece stays centre stage
const IDLE_MS = 9000; // how long after the visitor's last input autoplay resumes

/** Distance-to-transform for a card `d` steps from the centre of the arc. */
function place(d: number, ready: boolean) {
  const a = Math.abs(d);
  const x = a === 0 ? 0 : Math.sign(d) * (0.97 + (a - 1) * 0.8);
  const y = d * d * 0.11 + (ready ? 0 : 0.5);
  const scale = a === 0 ? 1 : 0.72 - Math.min(a - 1, 2) * 0.04;
  return {
    transform: `translate(calc(var(--w) * ${x}), calc(var(--w) * ${y})) rotate(${d * 7}deg) scale(${scale})`,
    opacity: !ready || a > 3 ? 0 : 1,
    zIndex: 10 - a,
    filter: a === 0 ? "none" : "saturate(0.85)",
    "--a": a,
  } as CSSProperties;
}

export function ArcCarousel({ works, ready = true, paused = false }: { works: Work[]; ready?: boolean; paused?: boolean }) {
  const router = useRouter();
  const n = works.length;
  // Repeat the list so the arc always has hidden cards to wrap round with.
  const copies = Math.max(1, Math.ceil(12 / n));
  const slots = Array.from({ length: n * copies }, (_, i) => works[i % n]);
  const L = slots.length;

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [entered, setEntered] = useState(false);
  const current = works[mod(active, n)];
  const lock = useRef(0);
  const acc = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  // Any input from the visitor pauses autoplay until they've been idle a while.
  const touched = useCallback(() => {
    setAuto(false);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setAuto(true), IDLE_MS);
  }, []);

  const step = useCallback(
    (by: number) => {
      if (paused) return;
      const now = performance.now();
      if (now < lock.current) return;
      lock.current = now + 520;
      touched();
      setActive((a) => a + by);
    },
    [paused, touched],
  );

  const playing = auto && !paused;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (!document.hidden) setActive((a) => a + 1);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [playing, active]);

  useEffect(() => () => clearTimeout(idle.current), []);

  // Stagger the cards in once, then let them move together.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setEntered(true), 1600);
    return () => clearTimeout(t);
  }, [ready]);

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
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [step]);

  return (
    <main
      className={`home${ready ? " is-ready" : ""}${entered ? " is-entered" : ""}`}
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
        <div className="home__right">
          <p key={`r${current.slug}`} className="home__cat serif swap">
            {current.category}
          </p>
          <div className="home__count">
            <span>{String(mod(active, n) + 1).padStart(2, "0")}</span>
            <span className="progress" aria-hidden>
              <span key={active} className={playing ? "is-running" : ""} style={{ animationDuration: `${AUTO_MS}ms` }} />
            </span>
            <span>{String(n).padStart(2, "0")}</span>
          </div>
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
              className={`arc__item${d === 0 ? " is-center" : ""}`}
              style={place(d, ready)}
              tabIndex={visible ? 0 : -1}
              aria-hidden={!visible}
              aria-label={d === 0 ? `Open ${w.title}` : `Show ${w.title}`}
              onClick={() => {
                if (drag.current?.moved) return;
                if (d === 0) router.push(`/works/${w.slug}`);
                else {
                  touched();
                  setActive((a) => a + d);
                }
              }}
            >
              {w.image && <Image src={w.image.src} alt="" fill sizes="(max-width: 720px) 52vw, 300px" priority={Math.abs(d) <= 2} draggable={false} />}
              {d === 0 && <span className="arc__view">View work ↗</span>}
            </button>
          );
        })}
      </div>

      <p className="home__hint">Scroll, drag or click to explore</p>
    </main>
  );
}
