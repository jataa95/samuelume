"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const INTRO_MS = 2800;

/**
 * Opens full-screen on the flame, then docks into a small looping film tile.
 * Clicking the tile plays the full process film in a lightbox.
 */
export function HomeFilm({ onReady, onLightbox }: { onReady: () => void; onLightbox: (open: boolean) => void }) {
  const [phase, setPhase] = useState<"intro" | "docked">("intro");
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const loop = useRef<HTMLVideoElement>(null);
  const full = useRef<HTMLVideoElement>(null);

  // Skip the intro on repeat visits in a session, and for reduced motion.
  // (layout.tsx adds `no-intro` to <html> before first paint in those cases.)
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
    const t = setTimeout(dock, INTRO_MS);
    const early = () => dock();
    window.addEventListener("wheel", early, { once: true, passive: true });
    window.addEventListener("pointerdown", early, { once: true });
    window.addEventListener("keydown", early, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", early);
      window.removeEventListener("pointerdown", early);
      window.removeEventListener("keydown", early);
    };
  }, []);

  useEffect(() => {
    if (phase === "docked") onReady();
  }, [phase, onReady]);

  useEffect(() => {
    onLightbox(open);
    if (!open) return;
    const tile = loop.current;
    full.current?.play().catch(() => {});
    tile?.pause();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      tile?.play().catch(() => {});
    };
  }, [open, onLightbox]);

  return (
    <>
      <div className={`film film--${phase}${instant ? " film--instant" : ""}`}>
        <button
          className="film__frame"
          onClick={() => phase === "docked" && setOpen(true)}
          tabIndex={phase === "docked" ? 0 : -1}
          aria-label="Watch the process film"
        >
          <video ref={loop} src="/video/fire-loop.mp4" poster="/video/fire-loop.jpg" autoPlay muted loop playsInline aria-hidden />
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
          <p className="film__name serif">{site.name}</p>
          <p className="film__tag">{site.tagline}</p>
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
