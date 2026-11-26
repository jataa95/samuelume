import { ArcCarousel } from "@/components/ArcCarousel";
import { Nav } from "@/components/Nav";
import { works } from "@/content/site";

export default function Home() {
  return (
    <>
      <ArcCarousel works={works.filter((w) => w.image)} />
      <Nav bottom />
    </>
  );
}
