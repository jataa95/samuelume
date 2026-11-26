import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/content/site";

export function WorkCard({ work, priority = false }: { work: Work; priority?: boolean }) {
  return (
    <Link href={`/works/${work.slug}`} className="card">
      <div className="card__media">
        {work.image ? (
          <Image src={work.image.src} alt={`${work.title} by Samuel Ume`} fill sizes="(max-width: 820px) 100vw, 38vw" priority={priority} />
        ) : (
          <div className="placeholder">
            <div>
              <p className="placeholder__title serif">{work.title}</p>
              <p className="placeholder__note">Image coming soon</p>
            </div>
          </div>
        )}
      </div>
      <div className="card__meta">
        <span className="card__title serif">{work.title}</span>
        <span className="card__sub">
          {work.category}
          {work.year ? ` · ${work.year}` : ""}
          {work.status ? ` · ${work.status}` : ""}
        </span>
      </div>
    </Link>
  );
}
