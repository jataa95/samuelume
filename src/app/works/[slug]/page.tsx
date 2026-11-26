import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoVideo } from "@/components/AutoVideo";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { WorkCard } from "@/components/WorkCard";
import { getWork, works } from "@/content/site";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const work = getWork((await params).slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.excerpt,
    openGraph: work.image ? { images: [work.image.src] } : undefined,
  };
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const work = getWork((await params).slug);
  if (!work) notFound();

  const i = works.indexOf(work);
  const more = [works[(i + 1) % works.length], works[(i + 2) % works.length]];
  const meta = [
    ["Year", work.year],
    ["Medium", work.medium],
    ["Size", work.size],
    ["Edition", work.edition],
    ["Status", work.status],
  ].filter(([, v]) => v) as [string, string][];
  const [first, ...rest] = work.story;

  return (
    <>
      <Nav />
      <main>
        <section className="hero dark">
          {work.image && <Image className="hero__bg" src={work.image.src} alt="" fill sizes="100vw" priority />}
          <div className="hero__inner">
            <Link href="/works" className="hero__back">
              ← All works
            </Link>
            <div>
              <h1 className="hero__title serif">{work.title}</h1>
              <p className="hero__excerpt">{work.excerpt}</p>
              <dl className="meta">
                {meta.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="hero__lede">
              {first.body.map((p) => (
                <p key={p.slice(0, 24)} style={{ marginBottom: "0.8em" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="artwork">
          <Reveal>
            {work.image ? (
              <div className="artwork__frame" style={{ "--r": work.image.width / work.image.height } as CSSProperties}>
                <Image src={work.image.src} alt={`${work.title} by Samuel Ume, ${work.medium}`} width={work.image.width} height={work.image.height} sizes="(max-width: 820px) 92vw, 860px" />
              </div>
            ) : (
              <div className="artwork__frame artwork__frame--empty">
                <div className="placeholder">
                  <div>
                    <p className="placeholder__title serif">{work.title}</p>
                    <p className="placeholder__note">Image coming soon</p>
                  </div>
                </div>
              </div>
            )}
            <p className="artwork__caption">
              <em className="serif">{work.title}</em>, {[work.medium, work.size, work.year].filter(Boolean).join(", ")}
            </p>
          </Reveal>
        </section>

        {work.quote && (
          <Reveal as="section" className="quote">
            <blockquote>&ldquo;{work.quote.text}&rdquo;</blockquote>
            <cite>— {work.quote.by}</cite>
          </Reveal>
        )}

        {rest.map((s) => (
          <Reveal as="section" key={s.heading ?? s.body[0]} className="story">
            <h2 className="serif">{s.heading}</h2>
            <div className="story__body">
              {s.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
        ))}

        {work.video && (
          <section className="process-film dark">
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>
                From the studio
              </p>
              <h2 className="serif">
                Watch {work.title}
                <br />
                come to life.
              </h2>
              <p className="muted" style={{ maxWidth: 360, fontSize: 14 }}>
                Sketched in graphite, burnt in with torch and palette knife, finished in acrylic.
              </p>
            </div>
            <AutoVideo name={work.video} label={`Process video of ${work.title}`} />
          </section>
        )}

        <section className="more">
          <h2 className="serif">More to explore.</h2>
          <p className="muted" style={{ fontSize: 13 }}>
            Other stories told in fire and acrylic.
          </p>
          <div className="more__grid">
            {more.map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
