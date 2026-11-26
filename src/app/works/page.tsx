import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { WorksGrid } from "@/components/WorksGrid";
import { works } from "@/content/site";

export const metadata: Metadata = { title: "Works" };

export default function WorksPage() {
  return (
    <>
      <Nav />
      <main className="page">
        <WorksGrid works={works} />
      </main>
      <Footer />
    </>
  );
}
