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
              className="text-[9vw] lg:text-[clamp(36px,min(8vw,13svh),180px)] motion-reduce:mt-[24px] text-center font-semibold origin-top  leading-[.95] tracking-[-.06em] motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[10%]"
            >
              {title}
            </p>
            <div
              data-chapter-pictures
              className="mx-auto mt-10 flex w-fit max-w-[92%] lg:max-w-[94%] items-start justify-center gap-[clamp(12px,1.2vw,28px)] motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[36%] motion-safe:lg:top-[33%] motion-safe:mt-0"
            >
              {works.map((work, index) => (
                <figure
                  key={work.slug}
                  className={
                    index
                      ? "mt-[3svh] min-w-0 max-w-[38vw]"
                      : "min-w-0 max-w-[38vw] text-right"
                  }
                >
                  <TransitionLink
                    href={`/oeuvres/${work.slug}`}
                    aria-label={`${work.title} — ${work.artist}, ${work.year}`}
                    className="block text-ink! no-underline!"
                  >
                    <ArtworkImage
                      src={work.image}
                      title={work.title}
                      contain
                      eager
                      naturalRatio
                      className="aspect-square max-w-full h-[min(26svh,35vw)] lg:h-[min(27svh,22vw)] bg-transparent!"
                      sizes="(max-width: 1023px) 43vw, 24vw"
                    />
                    <figcaption className="text-[13px] lg:text-[clamp(13px,min(1.2vw,1.9svh),22px)] mt-[12px] w-0 min-w-full leading-[1.35]">
                      <span>{work.title}</span>
                      <span className="mt-[6px] block text-muted">
                        {work.artist} · {work.year}
                      </span>
                    </figcaption>
                  </TransitionLink>
                </figure>
              ))}
            </div>
            <h2 className="text-[15vw] lg:text-[clamp(52px,min(14vw,19svh),270px)] motion-reduce:mt-[32px] pointer-events-none z-20 origin-bottom text-center font-editorial leading-[1.05]! tracking-[-.055em] text-foreground motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-[19svh] motion-safe:lg:bottom-[12svh]">
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
            <p className="max-w-4xl text-[clamp(28px,min(5vw,7svh),100px)] leading-tight tracking-tight">
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
