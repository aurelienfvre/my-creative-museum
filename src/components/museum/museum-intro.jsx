"use client";
import { useEffect, useRef } from "react";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { animateMuseumIntro, loadMuseumImage } from "./intro-motion";
import MuseumStory from "./museum-story";

export default function MuseumIntro({ portrait, works }) {
  const scope = useRef(null);
  const motion = useRef({ progress: 0, velocity: 0 });
  useEffect(
    () => loadMuseumImage(scope.current, portrait.image, motion.current),
    [portrait.image],
  );
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        (_context, contextSafe) => {
          const setup = contextSafe(() =>
            animateMuseumIntro(scope.current, contextSafe, motion.current),
          );
          return setup();
        },
      );
      return () => media.revert();
    },
    { scope },
  );
  return (
    <div
      ref={scope}
      className="group relative min-h-svh motion-safe:h-[440svh] motion-safe:lg:h-[520svh]"
    >
      <section
        data-full-frame
        className="page-gutter relative pb-8 pt-12 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-hidden lg:pt-10"
      >
        <div
          data-landing-frame
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-[15%] top-[10%] h-[58%] w-[70%] lg:left-[10%] lg:top-[12%] lg:h-[76%] lg:w-[38%]"
        />
        <canvas
          role="img"
          aria-label={portrait.title}
          className="pointer-events-none absolute inset-0 z-10 size-full opacity-0 group-data-[webgl=ready]:opacity-100"
        />
        <MuseumStory works={works} />
        <h1 className="text-[5.1rem] leading-[.95] tracking-[-.075em] text-foreground lg:text-[13rem]">
          Le musée<span className="font-editorial">.</span>
        </h1>
        <div className="mt-12 grid grid-cols-[1fr_1.1fr] items-end gap-7 lg:mt-16 lg:grid-cols-[1fr_1fr_1fr] lg:gap-14">
          <figure
            data-portrait
            className="relative col-span-2 mx-auto aspect-[4/5] w-[46%] max-w-72 lg:col-span-1 lg:col-start-2 lg:w-full"
          >
            <ArtworkImage
              src={portrait.image}
              title={portrait.title}
              preload
              className="absolute inset-0 size-full group-data-[webgl=ready]:opacity-0"
              sizes="100vw"
            />
          </figure>
          <p
            data-intro-copy
            className="col-span-2 pb-1 text-base lg:col-span-1 leading-relaxed lg:max-w-72 lg:text-xl"
          >
            Des œuvres du monde entier.
            <br />
            <span className="text-muted">
              Un espace pour prendre le temps de les regarder.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
