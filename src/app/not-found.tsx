import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="lost">
        <b>404</b>
        <p className="muted">Sorry, there&rsquo;s nothing here.</p>
        <Link href="/" style={{ fontSize: 13 }}>
          ← Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
