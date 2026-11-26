"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/** Act boundaries inside /video/intro-film.mp4 (seconds). Update if the film is re-cut. */
const FILM_LENGTH = 15.8;
const ACTS = [
  { at: 0, n: "I", word: "Line.", note: "Graphite on raw canvas" },
  { at: 3.6, n: "II", word: "Flame.", note: "Torch and palette knife" },
  { at: 9.6, n: "III", word: "Colour.", note: "Acrylic, last of all" },
];
const NAME_AT = 13.2;

/**
 * A short film of the process opens the home page full-screen, act by act,
 * then docks into a small looping tile. Clicking the tile plays a full
 * process film in a lightbox.
 */
export function HomeFilm({ onReady, onLightbox }: { onReady: () => void; onLightbox: (open: boolean) => void }) {
  const [phase, setPhase] = useState<"intro" | "docked">("intro");
  const [stage, setStage] = useState(0); // 0-2 = acts, 3 = name
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
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
    const dock = () => setPhase("docked");
    if (skip) {
      const t0 = setTimeout(() => {
        setInstant(true);
        dock();
      }, 0);
      return () => clearTimeout(t0);
    }

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
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      window.removeEventListener("wheel", early);
      window.removeEventListener("keydown", early);
    };
  }, []);

  useEffect(() => {
    if (phase !== "docked") return;
    onReady();
    const v = film.current;
    if (v) {
      v.loop = true;
      if (v.ended) v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [phase, onReady]);

  useEffect(() => {
    onLightbox(open);
    if (!open) return;
    const tile = film.current;
    full.current?.play().catch(() => {});
    tile?.pause();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      tile?.play().catch(() => {});
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
      <div className={`film film--${phase}${instant ? " film--instant" : ""}`}>
        <button
          className="film__frame"
          onClick={() => (phase === "docked" ? setOpen(true) : setPhase("docked"))}
          tabIndex={phase === "docked" ? 0 : -1}
          aria-label={phase === "docked" ? "Watch the process film" : "Skip intro"}
        >
          <video
            ref={film}
            src="/video/intro-film.mp4"
            poster="/video/intro-film.jpg"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={phase === "intro" ? onTime : undefined}
            onEnded={() => setPhase("docked")}
            aria-hidden
          />
          <span className="film__play" aria-hidden>
            ▶
          </span>
        </button>
        <span className="film__label">
          Painting with fire
          <br />
          <span className="muted">Watch the process</span>
        </span>

        <div className="film__intro" aria-hidden={phase !== "intro"}>
          <p className="film__brand serif">{site.name}</p>
          <button className="film__skip" onClick={() => setPhase("docked")} tabIndex={phase === "intro" ? 0 : -1}>
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
