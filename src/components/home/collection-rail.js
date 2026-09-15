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
      className="museum-carousel relative overflow-clip bg-background pt-12 pb-8"
      ref={scope}
      aria-label="Toute la collection"
    >
      <div className="museum-carousel-heading page-gutter relative z-1 shrink-0">
        <h2 className="whitespace-nowrap text-[clamp(2.5rem,6vw,6rem)] font-normal leading-none tracking-[-.055em]">
          À perte de <em className="font-editorial font-normal">vue.</em>
        </h2>
      </div>
      <div className="museum-carousel-stage relative mt-4 hidden min-h-0 flex-1 overflow-hidden [contain:layout_paint]">
        <canvas
          className="block size-full"
          role="img"
          aria-label="Carrousel des œuvres en trois dimensions"
        />
      </div>
      {active && (
        <div className="museum-carousel-caption hidden min-h-8 items-baseline justify-center gap-4 text-[.85rem]">
          <span className="font-mono text-[.65rem] text-muted">
            {String(activeIndex + 1).padStart(2, "0")} / {works.length}
          </span>
          <TransitionLink href={`/oeuvres/${active.slug}`}>
            {active.title}
          </TransitionLink>
        </div>
      )}
      <div className="museum-carousel-fallback flex gap-5 overflow-x-auto px-5 py-12 lg:gap-8 lg:px-14">
        {works.map((work, index) => (
          <TransitionLink
            className="museum-carousel-card min-w-0 grow-0 shrink-0 basis-[75vw] lg:basis-[23rem]"
            key={work.slug}
            href={`/oeuvres/${work.slug}`}
            data-cursor="artwork"
          >
            <ArtworkImage
              className="h-[22rem] lg:h-[24rem]"
              src={work.image}
              title={work.title}
              sizes="(max-width: 1023px) 65vw, 30vw"
            />
            <span className="mt-4 flex gap-4 text-[.85rem]">
              <small className="text-muted">
                {String(index + 1).padStart(2, "0")}
              </small>
              {work.title}
            </span>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
