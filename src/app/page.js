import RevealText from "@/components/animation/reveal-text";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import CollectionRail from "@/components/home/collection-rail";
import HomeMotion from "@/components/home/home-motion";
import ScrollGallery from "@/components/home/scroll-gallery";
import MuseumLogo from "@/components/ui/museum-logo";
import { getObjects, publicObject } from "@/lib/museum";

export default async function Home() {
  const objects = await getObjects();
  const pick = (slug) =>
    objects.find((object) => object.slug === slug) || objects[0];
  const hero = pick("the-birth-of-venus");
  const journey = [
    ["the-great-wave-off-kanagawa", "Se laisser emporter."],
    ["starry-night", "Voir la nuit autrement."],
    ["water-lilies", "Prendre le temps de ne rien faire."],
  ].map(([slug, line]) => ({ ...publicObject(pick(slug)), line }));
  return (
    <main id="main">
      <HomeMotion>
        <section className="home-cover page-gutter">
          <div className="home-cover-title">
            <h1>
              <span className="line-mask">
                <span data-hero-line>L’art.</span>
              </span>
              <span className="line-mask">
                <span data-hero-line>À votre</span>
              </span>
              <span className="line-mask">
                <span data-hero-line>
                  <em>façon.</em>
                </span>
              </span>
            </h1>
          </div>
          <figure className="home-cover-work">
            <TransitionLink
              href={`/oeuvres/${hero.slug}`}
              data-cursor="artwork"
              aria-label={`Découvrir ${hero.title}`}
            >
              <ArtworkImage
                src={hero.image}
                title={hero.title}
                preload
                sizes="(max-width: 1023px) 90vw, 53vw"
              />
            </TransitionLink>
            <figcaption>
              <span>{hero.artist}</span>
              <span>{hero.year}</span>
            </figcaption>
          </figure>
        </section>
      </HomeMotion>
      <section className="home-manifesto page-gutter">
        <MuseumLogo size={90} />
        <div>
          <RevealText
            followSelector=".manifesto-bottom"
            text="On n’a pas besoin de tout connaître pour ressentir quelque chose."
          />
          <div className="manifesto-bottom">
            <p>
              Un musée numérique pour les regards curieux. Des œuvres venues du
              monde entier, à découvrir à son rythme.
            </p>
          </div>
        </div>
      </section>
      <ScrollGallery works={journey} />
      <CollectionRail works={objects.map(publicObject)} />
    </main>
  );
}
