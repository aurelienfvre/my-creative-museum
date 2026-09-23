import BackButton from "@/components/animation/back-button";
import FavoriteButton from "@/components/favorites/favorite-button";
import ArtworkImage from "./artwork-image";
export default function ArtworkOpening({ object }) {
  return (
    <section className="artwork-opening page-gutter grid grid-cols-1 gap-6 pt-5 pb-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:pt-12 lg:pb-20">
      <div className="artwork-opening-copy flex min-w-0 flex-col items-start lg:py-4 max-lg:[&_.back-link]:mb-0 max-lg:[&_.back-link]:min-h-11">
        <BackButton href="/collection" />
        <h1
          className="mt-5 mb-4 text-[clamp(2rem,9vw,3.5rem)] leading-[1.05] font-normal tracking-[-.055em] text-foreground [overflow-wrap:anywhere] lg:mt-16 lg:mb-8 lg:text-[4.8rem] lg:leading-[1.02]"
          data-arrive
        >
          {object.title}
        </h1>
        <div
          className="artwork-signature flex flex-col gap-2 text-base"
          data-arrive
        >
          <span>{object.artist}</span>
          <span className="text-[.8rem] text-muted">{object.year}</span>
        </div>
        <div className="mt-6 max-w-full lg:mt-8" data-arrive>
          <FavoriteButton slug={object.slug} title={object.title} />
        </div>
      </div>
      <div
        className="artwork-opening-image mx-auto w-full max-w-xl [&_.artwork-image]:aspect-[4/5] [&_.artwork-image]:max-h-[65svh] [&_.artwork-image]:min-h-0 [&_.artwork-image]:bg-transparent lg:max-w-none lg:[&_.artwork-image]:h-[70vh] lg:[&_.artwork-image]:max-h-none lg:[&_.artwork-image]:min-h-[38rem]"
        data-arrive
      >
        <ArtworkImage
          src={object.image}
          title={`${object.title}, ${object.artist}, ${object.year}`}
          contain
          naturalRatio
          preload
          sizes="(max-width: 1023px) 90vw, 55vw"
        />
      </div>
    </section>
  );
}
