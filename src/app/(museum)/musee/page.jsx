import {
  artistChapters,
  introContent,
  passageContent,
} from "@/components/museum/data";
import MuseumArtists from "@/components/museum/museum-artists";
import MuseumIntro from "@/components/museum/museum-intro";
import MuseumPassage from "@/components/museum/museum-passage";
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
  const portrait = find(introContent.portraitSlug);
  const stream = works
    .filter((work) => work.slug !== portrait.slug)
    .slice(0, introContent.streamLimit)
    .map(publicObject);
  const chapters = artistChapters
    .map((chapter) => ({
      ...chapter,
      works: works
        .filter((work) => work.artist === chapter.artist)
        .slice(0, 2)
        .map(publicObject),
    }))
    .filter((chapter) => chapter.works.length === 2);
  const passage = works.find((work) => work.slug === passageContent.slug);
  const passageIndex =
    chapters.findIndex(({ artist }) => artist === passageContent.afterArtist) +
    1;
  const beforePassage = chapters.slice(0, passageIndex);
  const afterPassage = chapters.slice(passageIndex);
  return (
    <main id="main" tabIndex={-1}>
      <MuseumIntro portrait={publicObject(portrait)} works={stream} />
      {beforePassage.length > 0 && <MuseumArtists chapters={beforePassage} />}
      {passage && <MuseumPassage work={publicObject(passage)} />}
      {afterPassage.length > 0 && <MuseumArtists chapters={afterPassage} />}
    </main>
  );
}
