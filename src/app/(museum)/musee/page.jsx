import MuseumArtists from "@/components/museum/museum-artists";
import {
  artistChapters,
  introContent,
  passageContent,
} from "@/components/museum/museum-content";
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
  const bySlug = new Map(works.map((work) => [work.slug, work]));
  const selectWorks = (slugs) =>
    slugs
      .map((slug) => bySlug.get(slug))
      .filter(Boolean)
      .map(publicObject);
  const portrait = bySlug.get(introContent.portraitSlug) || works[0];
  const stream = selectWorks(introContent.streamSlugs);
  const chapters = artistChapters
    .map(({ slugs, ...chapter }) => ({
      ...chapter,
      works: selectWorks(slugs),
    }))
    .filter((chapter) => chapter.works.length === 2);
  const passage = bySlug.get(passageContent.slug);
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
