import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="footer dark">
      <div className="footer__top">
        <div>
          <h2 className="serif">Let&rsquo;s create.</h2>
          <p className="footer__lede">
            Commissions, acquisitions and collaborations.
            <br />
            Every piece starts with a story.
          </p>
          <div className="footer__cta">
            <a className="pill" href={`mailto:${site.email}`}>
              <span aria-hidden>✉</span> {site.email}
            </a>
          </div>
        </div>
        <div className="footer__right">
          <p className="footer__place">
            {site.alias}
            <br />
            {site.role}, {site.location}
          </p>
          <div className="footer__links">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>
          {site.name} © 2026 All rights reserved
        </span>
        <span>Made with fire &amp; acrylic</span>
      </div>
    </footer>
  );
}
