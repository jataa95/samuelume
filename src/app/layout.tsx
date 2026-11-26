import type { Metadata, Viewport } from "next";
import { Baskervville, Host_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const serif = Baskervville({ variable: "--font-serif", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap" });
const sans = Host_Grotesk({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

const title = `${site.name} — Paintings made with fire and acrylic`;
const description =
  "Samuel Ume (Artpostle Sam) is a Nigerian visual artist who paints with fire, torch, palette knife and acrylic, telling stories of heritage, childhood and memory.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description,
  openGraph: { title, description, url: site.url, siteName: site.name, type: "website", images: ["/works/hadassah.webp"] },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#0c0c0b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var h=document.documentElement;if(sessionStorage.getItem("su-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)h.classList.add("no-intro");else if(location.pathname==="/")h.classList.add("is-intro")}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
