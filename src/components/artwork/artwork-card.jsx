import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";

export default function ArtworkCard({ object, index = 0 }) {
  return (
    <TransitionLink
      href={`/oeuvres/${object.slug}`}
      aria-label={`${object.title} — ${object.artist}, ${object.year}`}
      className="artwork-card"
      data-cursor="artwork"
      data-transition
    >
      <div className="card-image-wrap relative overflow-hidden [&_.artwork-image]:aspect-[1.15] lg:[&_.artwork-image]:aspect-[4/5]">
        <ArtworkImage
          src={object.image}
          title={`${object.title} — ${object.artist}`}
          sizes="(max-width: 1023px) 85vw, 33vw"
        />
      </div>
      <div className="card-caption flex gap-4 pt-4">
        <span className="eyebrow pt-[.2rem] text-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="text-[1.03rem] font-normal tracking-[-.035em]">
            {object.title}
          </h3>
          <p className="mt-[.35rem] text-[.72rem] text-muted">
            {object.artist} <span>· {object.year}</span>
          </p>
        </div>
      </div>
    </TransitionLink>
  );
}
