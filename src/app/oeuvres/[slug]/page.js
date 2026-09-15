import { notFound } from "next/navigation";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkCard from "@/components/artwork/artwork-card";
import ArtworkImage from "@/components/artwork/artwork-image";
import Icon from "@/components/ui/icon";
import { getObject, getObjects } from "@/lib/museum";

export const revalidate = 3600;
export async function generateStaticParams() {
  return (await getObjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const object = await getObject(slug);
  if (!object) return { title: "Œuvre introuvable" };
  return {
    title: `${object.title} — ${object.artist}`,
    description: `Découvrez ${object.title} (${object.year}), de ${object.artist}. ${object.movement}. Œuvre conservée à ${object.location}.`,
  };
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
      <section className="artwork-opening page-gutter">
        <div className="artwork-opening-copy">
          <TransitionLink href="/collection" className="back-link">
            <Icon name="arrowLeft" />
            <FlipText>La collection</FlipText>
          </TransitionLink>
          <h1 data-arrive>{object.title}</h1>
          <div className="artwork-signature" data-arrive>
            <span>{object.artist}</span>
            <span>{object.year}</span>
          </div>
          <span className="artwork-movement" data-arrive>
            {object.movement}
          </span>
        </div>
        <div className="artwork-opening-image" data-arrive>
          <ArtworkImage
            src={object.image}
            title={`${object.title}, ${object.artist}, ${object.year}`}
            contain
            preload
            sizes="(max-width: 1023px) 90vw, 55vw"
          />
        </div>
      </section>
      <section className="detail-content page-gutter" data-reveal>
        <dl className="art-facts">
          <div>
            <dt>Artiste</dt>
            <dd>{object.artist}</dd>
          </div>
          <div>
            <dt>Année</dt>
            <dd>{object.year}</dd>
          </div>
          <div>
            <dt>Technique</dt>
            <dd>
              {object.type === "painting"
                ? "Peinture"
                : object.type === "woodblock print"
                  ? "Estampe sur bois"
                  : object.type}
            </dd>
          </div>
          <div>
            <dt>Mouvement</dt>
            <dd>{object.movement || "Non renseigné"}</dd>
          </div>
          <div>
            <dt>Palette</dt>
            <dd>{object.color || "Non renseignée"}</dd>
          </div>
          <div>
            <dt>Lieu de conservation</dt>
            <dd>
              {locationLink ? (
                <a href={locationLink} target="_blank" rel="noreferrer">
                  {object.location} <Icon name="arrowUpRight" />
                </a>
              ) : (
                object.location
              )}
            </dd>
          </div>
        </dl>
        <div className="art-description">
          <h2>
            Au-delà du <em>premier regard.</em>
          </h2>
          <p className="language-note">
            Notice de la collection · Texte original en anglais
          </p>
          <div
            lang="en"
            className="prose"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML sanitized with sanitize-html in lib/museum.js.
            dangerouslySetInnerHTML={{ __html: object.description }}
          />
          {gallery.length > 0 && (
            <div className="art-gallery">
              {gallery.map((url, index) =>
                /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url) &&
                ["upload.wikimedia.org", "www.moma.org"].includes(
                  new URL(url).hostname,
                ) ? (
                  <ArtworkImage
                    key={url}
                    src={url}
                    title={`${object.title} — vue complémentaire ${index + 1}`}
                    contain
                  />
                ) : (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    Consulter la ressource complémentaire {index + 1}{" "}
                    <Icon name="arrowUpRight" />
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </section>
      <section className="related-section page-gutter" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prolongez la rencontre</p>
            <h2>
              D’un regard <em>à l’autre.</em>
            </h2>
          </div>
          <TransitionLink href="/collection" className="text-link">
            <FlipText>Toute la collection</FlipText>{" "}
            <span>
              <Icon name="arrowUpRight" />
            </span>
          </TransitionLink>
        </div>
        <div className="selection-grid">
          {similar.map((item, index) => (
            <ArtworkCard object={item} key={item.id} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
