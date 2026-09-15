import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import ArtworkCard from "./artwork-card";
export default function ArtworkRelated({ similar }) {
  return (
    <section
      className="related-section page-gutter border-t border-line py-16"
      data-reveal
    >
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
      <div className="selection-grid grid grid-cols-1 gap-10 lg:grid-cols-3 [&_.artwork-card]:mt-0">
        {similar.map((item, index) => (
          <ArtworkCard object={item} key={item.id} index={index} />
        ))}
      </div>
    </section>
  );
}
