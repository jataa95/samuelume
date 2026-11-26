import { HomeStage } from "@/components/HomeStage";
import { Nav } from "@/components/Nav";
import { works } from "@/content/site";

export default function Home() {
  return (
    <>
      <HomeStage works={works.filter((w) => w.image)} />
      <Nav bottom />
    </>
  );
}
