import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";

export default function ArtworkCard({ object, index = 0 }) {
  return (
    <TransitionLink
      href={`/oeuvres/${object.slug}`}
      className="artwork-card"
      data-cursor="artwork"
      data-transition
    >
      <div className="card-image-wrap">
        <ArtworkImage
          src={object.image}
          title={`${object.title} — ${object.artist}`}
          sizes="(max-width: 1023px) 85vw, 33vw"
        />
      </div>
      <div className="card-caption">
        <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>{object.title}</h3>
          <p>
            {object.artist} <span>· {object.year}</span>
          </p>
        </div>
      </div>
    </TransitionLink>
  );
}
