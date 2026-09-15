"use client";
import { useRef, useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { useCollectionCarousel } from "./use-collection-carousel";
import "./collection-rail.css";

export default function CollectionRail({ works }) {
  const scope = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useCollectionCarousel(scope, works, setActiveIndex);
  const active = works[activeIndex] || works[0];
  return (
    <section
      className="museum-carousel"
      ref={scope}
      aria-label="Toute la collection"
    >
      <div className="museum-carousel-heading page-gutter">
        <h2>
          À perte de <em>vue.</em>
        </h2>
      </div>
      <div className="museum-carousel-stage">
        <canvas
          role="img"
          aria-label="Carrousel des œuvres en trois dimensions"
        />
      </div>
      {active && (
        <div className="museum-carousel-caption">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {works.length}
          </span>
          <TransitionLink href={`/oeuvres/${active.slug}`}>
            {active.title}
          </TransitionLink>
        </div>
      )}
      <div className="museum-carousel-fallback">
        {works.map((work, index) => (
          <TransitionLink
            className="museum-carousel-card"
            key={work.slug}
            href={`/oeuvres/${work.slug}`}
            data-cursor="artwork"
          >
            <ArtworkImage
              src={work.image}
              title={work.title}
              sizes="(max-width: 1023px) 65vw, 30vw"
            />
            <span>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {work.title}
            </span>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
