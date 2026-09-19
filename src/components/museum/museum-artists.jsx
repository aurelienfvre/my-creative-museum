"use client";

import { useRef } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { animateArtistChapters } from "./artist-motion";

export default function MuseumArtists({ chapters }) {
  const scope = useRef(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        animateArtistChapters(scope.current);
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <section
      ref={scope}
      className="relative motion-safe:h-[400svh]"
      aria-label="Des artistes, des regards"
    >
      <div
        data-artists-stage
        className="relative motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-clip"
      >
        {chapters.map(({ artist, title, works }, index) => (
          <article
            key={artist}
            data-chapter
            className={`page-gutter relative py-12 motion-safe:absolute motion-safe:inset-0 ${index ? "motion-safe:invisible" : ""}`}
          >
            <p
              data-chapter-title
              className="text-center font-semibold origin-top text-[clamp(2.5rem,8vw,9rem)] leading-[.95] tracking-[-.06em] motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[max(7svh,7rem)]"
            >
              {title}
            </p>
            <div
              data-chapter-pictures
              className="mx-auto mt-10 flex w-fit max-w-[94%] items-start justify-center gap-2 motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[32%] motion-safe:mt-0"
            >
              {works.map((work, index) => (
                <figure
                  key={work.slug}
                  className={index ? "mt-5 shrink-0" : "shrink-0 text-right"}
                >
                  <TransitionLink
                    href={`/oeuvres/${work.slug}`}
                    className="block text-ink! no-underline!"
                  >
                    <ArtworkImage
                      src={work.image}
                      title={work.title}
                      contain
                      eager
                      naturalRatio
                      className="aspect-square h-[min(24svh,29vw)] bg-transparent! lg:h-[28svh]"
                      sizes="(max-width: 1023px) 43vw, 24vw"
                    />
                    <figcaption className="mt-1 w-0 min-w-full text-sm leading-snug">
                      <span>{work.title}</span>
                      <span className="mt-1 block text-muted">
                        {work.artist} · {work.year}
                      </span>
                    </figcaption>
                  </TransitionLink>
                </figure>
              ))}
            </div>
            <h2 className="pointer-events-none z-20 origin-bottom text-center font-editorial text-[clamp(3.5rem,14vw,16rem)]! leading-[1.05]! tracking-[-.055em] text-foreground motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-[14svh]">
              {artist}
            </h2>
          </article>
        ))}
        {[
          ["pause", "D’une lumière à l’autre,", "le regard se transforme."],
          ["ending", "Le prochain regard,", "c’est le vôtre."],
        ].map(([key, line, emphasis]) => (
          <div
            key={key}
            data-chapter-message={key}
            className="page-gutter flex items-center justify-center py-24 text-center motion-safe:pointer-events-none motion-safe:invisible motion-safe:absolute motion-safe:inset-0"
          >
            <p className="max-w-4xl text-[clamp(2rem,5vw,5rem)] leading-tight tracking-tight">
              {line}
              <br />
              <em className="font-editorial text-foreground">{emphasis}</em>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
