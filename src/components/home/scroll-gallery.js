"use client";
import { useRef } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { useScrollGallery } from "./use-scroll-gallery";

export default function ScrollGallery({ works }) {
  const scope = useRef(null);
  useScrollGallery(scope, works);
  return (
    <section
      ref={scope}
      className="scroll-gallery page-gutter"
      aria-label="Trois regards sur la collection"
    >
      <div className="scroll-gallery-grid" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="scroll-gallery-stage">
        <div className="scroll-counter" aria-hidden="true">
          {works.map((work, index) => (
            <span className="scroll-count" key={work.slug}>
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="scroll-frames">
          {works.map((work) => (
            <TransitionLink
              key={work.slug}
              href={`/oeuvres/${work.slug}`}
              className="scroll-work"
              data-cursor="artwork"
              aria-label={`Découvrir ${work.title}`}
            >
              <ArtworkImage
                eager
                src={work.image}
                title={work.title}
                sizes="(max-width: 1023px) 90vw, 62vw"
              />
              <span className="scroll-static-caption">
                {work.artist} — {work.title}
              </span>
            </TransitionLink>
          ))}
        </div>
        <span className="scroll-total" aria-hidden="true">
          / {String(works.length).padStart(2, "0")}
        </span>
      </div>
      <div className="scroll-captions">
        {works.map((work) => (
          <div className="scroll-caption" key={work.slug}>
            <p>{work.line}</p>
            <span>
              {work.artist} · {work.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
