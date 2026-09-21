"use client";
import { useRef, useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { startCarousel } from "./carousel-runtime";

export default function CollectionRail({ works }) {
  const scope = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useCollectionCarousel(scope, works, setActiveIndex);
  const active = works[activeIndex] || works[0];
  return (
    <section
      className="museum-carousel group/carousel [&.has-webgl-carousel]:pt-[7.5rem] [&.has-webgl-carousel]:h-svh [&.has-webgl-carousel]:flex [&.has-webgl-carousel]:flex-col relative overflow-clip bg-background pt-12 pb-8"
      ref={scope}
      aria-label="Toute la collection"
    >
      <div className="museum-carousel-heading page-gutter relative z-1 shrink-0">
        <h2 className="whitespace-nowrap text-[clamp(2.5rem,6vw,6rem)] font-normal leading-none tracking-[-.055em]">
          À perte de <em className="font-editorial font-normal">vue.</em>
        </h2>
      </div>
      <div className="museum-carousel-stage group-[.has-webgl-carousel]/carousel:block relative mt-4 hidden min-h-0 flex-1 overflow-hidden [contain:layout_paint]">
        <canvas
          className="block size-full"
          role="img"
          aria-label="Carrousel des œuvres en trois dimensions"
        />
      </div>
      {active && (
        <div className="museum-carousel-caption group-[.has-webgl-carousel]/carousel:flex hidden min-h-8 items-baseline justify-center gap-4 text-[.85rem]">
          <span className="font-mono text-[.65rem] text-muted">
            {String(activeIndex + 1).padStart(2, "0")} / {works.length}
          </span>
          <TransitionLink href={`/oeuvres/${active.slug}`}>
            {active.title}
          </TransitionLink>
        </div>
      )}
      <div className="museum-carousel-fallback group-[.has-webgl-carousel]/carousel:absolute group-[.has-webgl-carousel]/carousel:size-px group-[.has-webgl-carousel]/carousel:overflow-hidden group-[.has-webgl-carousel]/carousel:[clip-path:inset(50%)] group-[.has-webgl-carousel]/carousel:p-0 group-[.has-webgl-carousel]/carousel:focus-within:[clip-path:none] group-[.has-webgl-carousel]/carousel:focus-within:w-[min(25rem,90%)] group-[.has-webgl-carousel]/carousel:focus-within:h-auto group-[.has-webgl-carousel]/carousel:focus-within:bottom-4 group-[.has-webgl-carousel]/carousel:focus-within:left-4 group-[.has-webgl-carousel]/carousel:focus-within:z-3 group-[.has-webgl-carousel]/carousel:focus-within:bg-background group-[.has-webgl-carousel]/carousel:focus-within:p-4 flex gap-5 overflow-x-auto px-5 py-12 lg:gap-8 lg:px-14">
        {works.map((work, index) => (
          <TransitionLink
            className="museum-carousel-card group-[.has-webgl-carousel]/carousel:basis-80 min-w-0 grow-0 shrink-0 basis-[75vw] lg:basis-[23rem]"
            key={work.slug}
            href={`/oeuvres/${work.slug}`}
            data-cursor="artwork"
          >
            <ArtworkImage
              className="h-[22rem] lg:h-[24rem] group-[.has-webgl-carousel]/carousel:hidden"
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

function useCollectionCarousel(scope, works, setActiveIndex) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (works.length < 2) return;
          return startCarousel(scope.current, works, setActiveIndex);
        },
      );
      return () => media.revert();
    },
    {
      scope,
      dependencies: [works.map((work) => work.slug).join("|")],
      revertOnUpdate: true,
    },
  );
}
