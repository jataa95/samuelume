"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/** Act boundaries inside /video/intro-film.mp4 (seconds). Update if the film is re-cut. */
const FILM_LENGTH = 10.53;
const ACTS = [
  { at: 0, n: "I", word: "Line.", note: "Graphite on raw canvas" },
  { at: 2.4, n: "II", word: "Flame.", note: "Torch and palette knife" },
  { at: 6.4, n: "III", word: "Colour.", note: "Acrylic, last of all" },
];
const NAME_AT = 8.8;

/**
 * A short film of the process opens the home page full-screen, act by act,
 * then stays on as the darkened, looping hero background behind the
 * carousel. "Watch the process film" plays a full process video in a lightbox.
 */
export function HomeFilm({ onReady, onLightbox }: { onReady: () => void; onLightbox: (open: boolean) => void }) {
  const [phase, setPhase] = useState<"intro" | "bg">("intro");
  const [stage, setStage] = useState(0); // 0-2 = acts, 3 = name
  const [open, setOpen] = useState(false);
  const film = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const full = useRef<HTMLVideoElement>(null);

  // Skip the intro on repeat visits in a session, and for reduced motion
  // (layout.tsx adds `no-intro` to <html> before first paint in those cases).
  useEffect(() => {
    const skip = document.documentElement.classList.contains("no-intro");
    try {
      sessionStorage.setItem("su-intro", "1");
    } catch {}
    const dock = () => setPhase("bg");
    if (skip) {
      const t0 = setTimeout(dock, 0);
      return () => clearTimeout(t0);
    }

    document.documentElement.classList.add("is-intro");
    const v = film.current;
    let raf = 0;
    const tick = () => {
      if (v && bar.current) bar.current.style.transform = `scaleX(${Math.min(1, v.currentTime / FILM_LENGTH)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // If autoplay is blocked, don't hold visitors on a still frame.
    v?.play().catch(() => setTimeout(dock, 2500));
    // Safety net in case the video stalls.
    const fallback = setTimeout(dock, (FILM_LENGTH + 6) * 1000);

    const early = () => dock();
    window.addEventListener("wheel", early, { once: true, passive: true });
    window.addEventListener("keydown", early, { once: true });
    return () => {
      document.documentElement.classList.remove("is-intro");
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      window.removeEventListener("wheel", early);
      window.removeEventListener("keydown", early);
    };
  }, []);

  useEffect(() => {
    if (phase !== "bg") return;
    document.documentElement.classList.remove("is-intro");
    onReady();
    const v = film.current;
    if (v) {
      v.loop = true;
      if (v.ended) v.currentTime = 0;
      // Keep a still background for visitors who prefer reduced motion.
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
      else v.play().catch(() => {});
    }
  }, [phase, onReady]);

  useEffect(() => {
    onLightbox(open);
    if (!open) return;
    const bg = film.current;
    full.current?.play().catch(() => {});
    bg?.pause();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      bg?.play().catch(() => {});
    };
  }, [open, onLightbox]);

  const onTime = () => {
    const t = film.current?.currentTime ?? 0;
    const next = t >= NAME_AT ? 3 : ACTS.reduce((s, a, i) => (t >= a.at ? i : s), 0);
    if (next !== stage) setStage(next);
  };

  const act = ACTS[Math.min(stage, 2)];

  return (
    <>
      <div className={`film film--${phase}`}>
        <button className="film__frame" onClick={() => setPhase("bg")} tabIndex={-1} aria-label="Skip intro">
          <video
            ref={film}
            src="/video/intro-film.mp4"
            poster="/video/intro-film.jpg"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={phase === "intro" ? onTime : undefined}
            onEnded={() => setPhase("bg")}
            aria-hidden
          />
        </button>
        <div className="film__shade" aria-hidden />

        <div className="film__intro" aria-hidden={phase !== "intro"}>
          <p className="film__brand serif">{site.name}</p>
          <button className="film__skip" onClick={() => setPhase("bg")} tabIndex={phase === "intro" ? 0 : -1}>
            Skip intro →
          </button>

          {stage < 3 ? (
            <div key={stage} className="film__act">
              <p className="film__num serif">{act.n}.</p>
              <p className="film__word serif">{act.word}</p>
              <p className="film__note">{act.note}</p>
            </div>
          ) : (
            <div key="name" className="film__act film__act--name">
              <p className="film__name serif">{site.name}</p>
              <p className="film__tag">{site.tagline}</p>
            </div>
          )}

          <div className="film__track">
            <div className="film__chapters">
              {ACTS.map((a, i) => (
                <span key={a.n} className={i === Math.min(stage, 2) ? "is-on" : ""} style={{ left: `${(a.at / FILM_LENGTH) * 100}%` }}>
                  {a.n} {a.word.replace(".", "")}
                </span>
              ))}
            </div>
            <span className="film__bar">
              <span ref={bar} />
            </span>
          </div>
        </div>
      </div>

      {phase === "bg" && (
        <button className="film__watch" onClick={() => setOpen(true)}>
          <i aria-hidden>▶</i> Watch the process film
        </button>
      )}

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Process film: Hadassah" onClick={() => setOpen(false)}>
          <video ref={full} src="/video/hadassah-process.mp4" poster="/video/hadassah-process.jpg" controls muted playsInline onClick={(e) => e.stopPropagation()} />
          <div className="lightbox__meta">
            <p className="serif">Hadassah, from sketch to flame to colour</p>
            <button onClick={() => setOpen(false)} autoFocus>
              Close ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
