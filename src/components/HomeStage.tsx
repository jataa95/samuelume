"use client";

import { useCallback, useState } from "react";
import type { Work } from "@/content/site";
import { ArcCarousel } from "./ArcCarousel";
import { HomeFilm } from "./HomeFilm";

export function HomeStage({ works }: { works: Work[] }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return (
    <>
      <ArcCarousel works={works} ready={ready} paused={!ready} />
      <HomeFilm onReady={onReady} />
    </>
  );
}
