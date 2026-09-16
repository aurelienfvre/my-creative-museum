import ArtworkBackButton from "./artwork-back-button";
import ArtworkImage from "./artwork-image";
export default function ArtworkOpening({ object }) {
  return (
    <section className="artwork-opening page-gutter grid grid-cols-1 gap-8 py-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:pt-12 lg:pb-20">
      <div className="artwork-opening-copy flex flex-col items-start py-4">
        <ArtworkBackButton />
        <h1
          className="mt-8 mb-6 text-[3rem] leading-[1.02] font-normal tracking-[-.055em] text-foreground [overflow-wrap:anywhere] lg:mt-16 lg:mb-8 lg:text-[4.8rem]"
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
        <span
          className="artwork-movement mt-auto pt-6 text-[.75rem] text-muted lg:pt-12"
          data-arrive
        >
          {object.movement}
        </span>
      </div>
      <div
        className="artwork-opening-image [&_.artwork-image]:h-[55svh] [&_.artwork-image]:min-h-0 [&_.artwork-image]:bg-transparent lg:[&_.artwork-image]:h-[70vh] lg:[&_.artwork-image]:min-h-[38rem]"
        data-arrive
      >
        <ArtworkImage
          src={object.image}
          title={`${object.title}, ${object.artist}, ${object.year}`}
          contain
          preload
          sizes="(max-width: 1023px) 90vw, 55vw"
        />
      </div>
    </section>
  );
}
