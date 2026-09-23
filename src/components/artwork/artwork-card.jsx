import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";

export default function ArtworkCard({ object, index = 0 }) {
  return (
    <TransitionLink
      href={`/oeuvres/${object.slug}`}
      aria-label={`${object.title} — ${object.artist}, ${object.year}`}
      className="artwork-card block min-w-0"
      data-cursor="artwork"
      data-transition
    >
      <div className="card-image-wrap relative overflow-hidden [&_.artwork-image]:aspect-[1.15] lg:[&_.artwork-image]:aspect-[4/5]">
        <ArtworkImage
          src={object.image}
          title={`${object.title} — ${object.artist}`}
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 46vw, 33vw"
        />
      </div>
      <div className="card-caption flex gap-3 pt-3 lg:gap-4 lg:pt-4">
        <span className="eyebrow shrink-0 pt-[.2rem] text-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="text-base leading-snug font-normal tracking-[-.035em] [overflow-wrap:anywhere] lg:text-[1.03rem] lg:leading-normal">
            {object.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted lg:mt-[.35rem] lg:text-[.72rem] lg:leading-normal">
            {object.artist} <span>· {object.year}</span>
          </p>
        </div>
      </div>
    </TransitionLink>
  );
}
