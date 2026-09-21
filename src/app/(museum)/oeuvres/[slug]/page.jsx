import { notFound } from "next/navigation";
import ArtworkDetails from "@/components/artwork/artwork-details";
import ArtworkOpening from "@/components/artwork/artwork-opening";
import ArtworkRelated from "@/components/artwork/artwork-related";
import { pageMetadata } from "@/lib/metadata";
import { getObject, getObjects } from "@/lib/museum";

export const revalidate = 3600;
export async function generateStaticParams() {
  return (await getObjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const object = await getObject(slug);
  if (!object) return { title: "Œuvre introuvable" };
  return pageMetadata({
    path: `/oeuvres/${slug}`,
    title: `${object.title} — ${object.artist}`,
    description: `Découvrez ${object.title} (${object.year}), de ${object.artist}. ${object.movement}. Œuvre conservée à ${object.location}.`,
  });
}
function safeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
export default async function ArtworkPage({ params }) {
  const { slug } = await params;
  const object = await getObject(slug);
  if (!object) notFound();
  const objects = await getObjects();
  const others = objects.filter((item) => item.id !== object.id);
  const similar = [...others]
    .sort((a, b) => {
      const score = (item) =>
        (item.artist === object.artist ? 4 : 0) +
        (item.movement === object.movement ? 2 : 0) -
        Math.abs(item.year - object.year) / 1000;
      return score(b) - score(a);
    })
    .slice(0, 3);
  const locationLink = safeLink(object.locationLink);
  const gallery = object.gallery.filter((url) => url !== object.image);
  return (
    <main id="main">
      <ArtworkOpening object={object} />
      <ArtworkDetails
        object={object}
        locationLink={locationLink}
        gallery={gallery}
      />
      <ArtworkRelated similar={similar} />
    </main>
  );
}
