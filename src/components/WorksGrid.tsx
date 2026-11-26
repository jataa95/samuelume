"use client";

import { useState } from "react";
import { categories, type Work } from "@/content/site";
import { WorkCard } from "./WorkCard";

export function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<string>("All");
  const options = ["All", ...categories].map((c) => ({
    label: c,
    count: c === "All" ? works.length : works.filter((w) => w.category === c).length,
  }));
  const shown = filter === "All" ? works : works.filter((w) => w.category === filter);

  return (
    <div className="works wrap">
      <div className="filters" role="group" aria-label="Filter works">
        {options.map((o) => (
          <button key={o.label} aria-pressed={filter === o.label} onClick={() => setFilter(o.label)}>
            {o.label}
            <sup>({o.count})</sup>
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((w, i) => (
          <div key={w.slug} className="swap" style={{ animationDelay: `${i * 60}ms` }}>
            <WorkCard work={w} priority={i < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}
