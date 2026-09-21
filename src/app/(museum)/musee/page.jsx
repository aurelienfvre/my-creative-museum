import MuseumArtists from "@/components/museum/museum-artists";
import MuseumIntro from "@/components/museum/museum-intro";
import { pageMetadata } from "@/lib/metadata";
import { getObjects, publicObject } from "@/lib/museum";

export const metadata = pageMetadata({
  path: "/musee",
  title: "Le musée",
  description: "Un musée numérique ouvert à tous les regards.",
});
export default async function MuseumPage() {
  const works = await getObjects();
  const find = (slug) => works.find((work) => work.slug === slug) || works[0];
  const portrait = find("girl-with-a-pearl-earring");
  const stream = works
    .filter((work) => work.slug !== portrait.slug)
    .slice(0, 4)
    .map(publicObject);
  const chapters = ["Claude Monet", "Vincent van Gogh"]
    .map((artist, index) => ({
      artist,
      title: index ? "La nuit en couleurs" : "Au fil de la lumière",
      works: works
        .filter((work) => work.artist === artist)
        .slice(0, 2)
        .map(publicObject),
    }))
    .filter((chapter) => chapter.works.length === 2);
  return (
    <main id="main" tabIndex={-1}>
      <MuseumIntro portrait={publicObject(portrait)} works={stream} />
      <MuseumArtists chapters={chapters} />
    </main>
  );
}
