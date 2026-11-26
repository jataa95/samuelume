"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
];

export function Nav({ bottom = false }: { bottom?: boolean }) {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav className={`nav${bottom ? " nav--bottom" : ""}`} aria-label="Main">
      <Link href="/" className="nav__brand">
        {site.name}
      </Link>
      <div className="nav__links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
      <a className="nav__contact" href={`mailto:${site.email}`}>
        Contact ↗
      </a>
    </nav>
  );
}
