"use client";
import { useRef } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { startScrollGallery } from "./gallery-runtime";

export default function ScrollGallery({ works }) {
  const scope = useRef(null);
  useScrollGallery(scope, works);
  return (
    <section
      ref={scope}
      className="scroll-gallery  group/gallery [&.is-pinned-gallery]:h-svh [&.is-pinned-gallery]:flex [&.is-pinned-gallery]:flex-col [&.is-pinned-gallery]:justify-center [&.is-pinned-gallery]:gap-[4vh] page-gutter relative bg-background py-12"
      aria-label="Trois regards sur la collection"
    >
      <div
        className="scroll-gallery-grid pointer-events-none absolute inset-y-0 inset-x-[20%] flex justify-between"
        aria-hidden="true"
      >
        <i className="w-px bg-ink/[.06]" />
        <i className="w-px bg-ink/[.06]" />
        <i className="w-px bg-ink/[.06]" />
      </div>
      <div className="scroll-gallery-stage relative grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_minmax(0,62vw)_1fr] lg:gap-8">
        <div
          className="scroll-counter group-[.is-pinned-gallery]/gallery:block group-[.is-pinned-gallery]/gallery:h-6 group-[.is-pinned-gallery]/gallery:relative group-[.is-pinned-gallery]/gallery:overflow-hidden max-lg:group-[.is-pinned-gallery]/gallery:w-8 hidden font-mono text-[.8rem]"
          aria-hidden="true"
        >
          {works.map((work, index) => (
            <span className="scroll-count absolute inset-0" key={work.slug}>
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="scroll-frames group-[.is-pinned-gallery]/gallery:relative group-[.is-pinned-gallery]/gallery:h-[50svh] lg:group-[.is-pinned-gallery]/gallery:h-[min(59vh,35rem)]">
          {works.map((work) => (
            <TransitionLink
              key={work.slug}
              href={`/oeuvres/${work.slug}`}
              className="scroll-work group-[.is-pinned-gallery]/gallery:absolute group-[.is-pinned-gallery]/gallery:inset-0 group-[.is-pinned-gallery]/gallery:overflow-hidden group-[.is-pinned-gallery]/gallery:m-0 group-[.is-pinned-gallery]/gallery:will-change-[clip-path] group-[.is-pinned-gallery]/gallery:origin-center group-[.is-pinned-gallery]/gallery:backface-hidden mb-8 block"
              data-cursor="artwork"
              aria-label={`Découvrir ${work.title}`}
            >
              <ArtworkImage
                className="aspect-[1.78] group-[.is-pinned-gallery]/gallery:size-full"
                eager
                src={work.image}
                title={work.title}
                sizes="(max-width: 1023px) 90vw, 62vw"
              />
              <span className="scroll-static-caption group-[.is-pinned-gallery]/gallery:hidden mt-[.8rem] block text-[.8rem]">
                {work.artist} — {work.title}
              </span>
            </TransitionLink>
          ))}
        </div>
        <span
          className="scroll-total group-[.is-pinned-gallery]/gallery:block group-[.is-pinned-gallery]/gallery:text-right max-lg:group-[.is-pinned-gallery]/gallery:absolute max-lg:group-[.is-pinned-gallery]/gallery:right-0 max-lg:group-[.is-pinned-gallery]/gallery:top-0 hidden font-mono text-[.8rem]"
          aria-hidden="true"
        >
          / {String(works.length).padStart(2, "0")}
        </span>
      </div>
      <div className="scroll-captions group-[.is-pinned-gallery]/gallery:grid group-[.is-pinned-gallery]/gallery:text-center group-[.is-pinned-gallery]/gallery:h-20 group-[.is-pinned-gallery]/gallery:overflow-hidden hidden">
        {works.map((work) => (
          <div className="scroll-caption [grid-area:1/1]" key={work.slug}>
            <p className="font-editorial text-[1.7rem] text-ink lg:text-[2rem]">
              {work.line}
            </p>
            <span className="mt-2 block text-[.65rem] text-muted lg:text-[.68rem]">
              {work.artist} · {work.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function useScrollGallery(scope, works) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () =>
        startScrollGallery(scope.current),
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
