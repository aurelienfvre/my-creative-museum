import RevealText from "@/components/animation/reveal-text";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import CollectionRail from "@/components/home/collection-rail";
import HomeMotion from "@/components/home/home-motion";
import ScrollGallery from "@/components/home/scroll-gallery";
import MuseumLogo from "@/components/ui/museum-logo";
import { pageMetadata } from "@/lib/metadata";
import { getObjects, publicObject } from "@/lib/museum";

export const metadata = pageMetadata({
  title: "Le goût de regarder autrement",
  path: "/",
});

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
    <main id="main" tabIndex={-1}>
      <HomeMotion>
        <section className="home-cover page-gutter relative grid grid-cols-1 gap-8 pt-8 pb-12 lg:grid-cols-[0.95fr_1.1fr] lg:pt-12 lg:pb-20">
          <div className="home-cover-title z-1 pt-0 lg:pt-[1.3rem]">
            <h1 className="flex flex-col text-[5.3rem] leading-[1] tracking-[-0.075em] font-normal text-foreground lg:text-[8.6rem]">
              <span className="line-mask block overflow-hidden pt-[.16em] px-[.08em] pb-[.23em] -mt-[.16em] -mx-[.08em] -mb-[.23em] [&>span]:block motion-safe:[perspective:800px]">
                <span data-hero-line>L’art.</span>
              </span>
              <span className="line-mask block overflow-hidden pt-[.16em] px-[.08em] pb-[.23em] -mt-[.16em] -mx-[.08em] -mb-[.23em] [&>span]:block motion-safe:[perspective:800px]">
                <span data-hero-line>À votre</span>
              </span>
              <span className="line-mask block overflow-hidden pt-[.16em] px-[.08em] pb-[.23em] -mt-[.16em] -mx-[.08em] -mb-[.23em] [&>span]:block motion-safe:[perspective:800px] -mt-[0.3em]!">
                <span data-hero-line>
                  <em className="font-editorial font-normal tracking-[-0.045em]">
                    façon.
                  </em>
                </span>
              </span>
            </h1>
          </div>
          <figure className="home-cover-work motion-safe:[clip-path:inset(12%_0%_12%_100%)] m-0 pt-0 lg:pt-[2.4rem]">
            <TransitionLink
              className="block overflow-hidden"
              href={`/oeuvres/${hero.slug}`}
              data-cursor="artwork"
              aria-label={`Découvrir ${hero.title}`}
            >
              <ArtworkImage
                className="h-[23rem] lg:h-[33rem]"
                src={hero.image}
                title={hero.title}
                preload
                sizes="(max-width: 1023px) 90vw, 53vw"
              />
            </TransitionLink>
            <figcaption className="mt-[.8rem] flex justify-between text-[.65rem] text-muted">
              <span>{hero.artist}</span>
              <span>{hero.year}</span>
            </figcaption>
          </figure>
        </section>
      </HomeMotion>
      <section className="home-manifesto [.home-motion:not([data-hero-ready=true])+&]:invisible page-gutter grid grid-cols-1 gap-8 py-12 text-ink lg:grid-cols-[1fr_3fr] lg:gap-16 lg:py-24">
        <MuseumLogo size={90} className="size-14 rotate-[-8deg] lg:size-24" />
        <div>
          <RevealText
            className="text-[2.5rem] leading-[1.1] tracking-[-.055em] lg:text-[3.8rem]"
            followSelector=".manifesto-bottom"
            text="On n’a pas besoin de tout connaître pour ressentir quelque chose."
          />
          <div className="manifesto-bottom mt-6 flex flex-col items-start justify-between gap-6 lg:mt-10 lg:flex-row lg:items-end lg:gap-16">
            <p className="max-w-[22rem] text-[.95rem] leading-[1.7] text-muted">
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
