import type { Metadata } from "next";
import Image from "next/image";
import { AutoVideo } from "@/components/AutoVideo";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { process, site, works } from "@/content/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  const gallery = works.filter((w) => w.image).slice(0, 4);
  return (
    <>
      <Nav />
      <main className="page">
        <section className="about-intro wrap">
          <Reveal as="h1">
            I&rsquo;m Samuel Ume. I paint with fire, then colour, to tell stories of heritage, childhood and the heroes nobody notices.
          </Reveal>
          <div className="about-intro__text">
            <p>
              Known to most as {site.alias}, I&rsquo;m a Christian and a visual artist working in {site.location}. My canvases are drawn in graphite, toned with a torch and a heated
              palette knife, and finished in acrylic.
            </p>
            <p>
              My work aims to inspire, uplift and challenge societal norms: celebrating African beauty and heritage, the elder siblings who raised the rest of us, and the
              quiet weight behind the lives we only see from the outside.
            </p>
          </div>
          <div className="about-intro__media">
            <Reveal style={{ aspectRatio: "4 / 5" }}>
              <Image src="/works/hairitage.webp" alt="Hairitage by Samuel Ume" fill sizes="(max-width: 820px) 40vw, 20vw" />
            </Reveal>
            <Reveal style={{ aspectRatio: "3 / 5" }}>
              <Image src="/about/samuel.webp" alt="Samuel Ume beside Hadassah, lighter in hand" fill sizes="(max-width: 820px) 55vw, 28vw" priority />
            </Reveal>
          </div>
        </section>

        <section className="process dark">
          <div className="process__head">
            <h2 className="serif">
              Line, flame,
              <br />
              then colour.
            </h2>
            <p className="muted" style={{ alignSelf: "end", maxWidth: 380, fontSize: 14 }}>
              Every piece moves through the same three stages. The fire does the shading; the acrylic places the story in its world.
            </p>
          </div>
          <div className="panels">
            {process.map((p) => (
              <article key={p.n} className="panel">
                <AutoVideo name={p.video} label={`${p.title} stage`} />
                <h3>
                  <span>{p.n}.</span>
                  {p.title}
                </h3>
                <p>{p.body}</p>
                <ul>
                  {p.points.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="stats">
          <h2 className="serif">Day after day, posting fire art until everyone sees it.</h2>
          {site.stats.map((s) => (
            <div key={s.label} className="stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section className="gallery">
          {gallery.map((w) => (
            <Reveal as="figure" key={w.slug}>
              <Image src={w.image!.src} alt={`${w.title} by Samuel Ume`} fill sizes="(max-width: 820px) 100vw, 50vw" />
              <figcaption className="serif">{w.title}</figcaption>
            </Reveal>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
