"use client";

import { useRef } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { animateArtistChapters } from "./artist-motion";
import { artistMotion, museumMotion } from "./motion.config";

export default function MuseumArtists({ chapters }) {
  const scope = useRef(null);
  const scrollDistance = chapters.reduce(
    (height, chapter) =>
      height +
      (chapter.reflection
        ? artistMotion.scroll.withReflection
        : artistMotion.scroll.withoutReflection),
    0,
  );
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(museumMotion.media.chapters, (_context, contextSafe) => {
        return animateArtistChapters(scope.current, contextSafe);
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <section
      ref={scope}
      className="relative museum-motion:h-[var(--chapters-height)]"
      style={{
        "--chapters-height": `${100 + scrollDistance}svh`,
      }}
      aria-label={`Les œuvres de ${chapters.map(({ artist }) => artist).join(" et ")}`}
    >
      <div
        data-artists-stage
        className="relative museum-motion:sticky museum-motion:top-0 museum-motion:h-svh museum-motion:overflow-clip"
      >
        {chapters.map(({ artist, title, works, reflection }, index) => (
          <article
            key={artist}
            data-chapter
            className={`page-gutter pointer-events-none relative py-12 museum-motion:absolute museum-motion:inset-0`}
          >
            <div
              data-chapter-composition
              className={`relative pointer-events-auto museum-motion:absolute museum-motion:inset-0 ${index ? "museum-motion:invisible" : ""}`}
            >
              <p
                data-chapter-title
                className="text-[8.5vw] lg:text-[clamp(40px,min(7.5vw,12svh),160px)] mt-6 museum-motion:mt-0 text-center font-semibold origin-bottom  leading-[.95] tracking-[-.06em] museum-motion:absolute museum-motion:inset-x-0 museum-motion:top-[10%]"
              >
                {title}
              </p>
              <div
                data-chapter-pictures
                className="mx-auto mt-10 flex w-fit max-w-[92%] lg:max-w-[94%] items-start justify-center gap-[clamp(12px,1.2vw,26px)] museum-motion:absolute museum-motion:inset-x-0 museum-motion:top-[34%] museum-motion:mt-0"
              >
                {works.map((work, index) => (
                  <figure
                    key={work.slug}
                    className={
                      index
                        ? "mt-[3svh] min-w-0 max-w-[41vw]"
                        : "min-w-0 max-w-[41vw] text-right"
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
                        className="aspect-square max-w-full h-[min(27svh,40vw)] lg:h-[min(29svh,24vw)] bg-transparent!"
                        sizes="(max-width: 1023px) 43vw, 24vw"
                      />
                    </TransitionLink>
                    <figcaption className="text-[14px] lg:text-[clamp(14px,min(1.2vw,1.9svh),22px)] mt-3 w-0 min-w-full leading-[1.4] text-pretty">
                      <span>{work.title}</span>
                      <span className="mt-[6px] block text-muted">
                        <span className="hidden lg:inline">
                          {work.artist} ·{" "}
                        </span>
                        {work.year}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <h2 className="text-[11vw] whitespace-nowrap lg:text-[clamp(52px,min(12vw,17svh),250px)] mt-8 pointer-events-none z-20 origin-top text-center font-editorial leading-[1.05]! tracking-[-.055em] text-foreground museum-motion:absolute museum-motion:inset-x-0 museum-motion:mt-0">
                {artist}
              </h2>
            </div>
            {reflection && (
              <p
                data-chapter-message
                className="pointer-events-none mx-auto max-w-[24ch] whitespace-pre-line px-6 py-12 text-center text-[clamp(28px,4.5vw,72px)] font-medium leading-[1.12] tracking-[-.04em] museum-motion:absolute museum-motion:inset-0 museum-motion:m-auto museum-motion:h-fit museum-motion:invisible museum-motion:py-0"
              >
                {reflection}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
