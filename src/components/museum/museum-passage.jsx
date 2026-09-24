"use client";

import { useRef, useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import Media from "@/components/ui/media";
import { gsap, useGSAP } from "@/lib/gsap";
import { museumMotion, passageMotion } from "./motion.config";
import { passageContent } from "./museum-content";
import { animateMuseumPassage } from "./passage-motion";

export default function MuseumPassage({ work }) {
  const scope = useRef(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === work.image;
  const sizes = "(max-width: 1023px) 90vw, 56vw";
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(museumMotion.media.chapters, (_context, contextSafe) =>
        animateMuseumPassage(scope.current, contextSafe),
      );
      return () => media.revert();
    },
    { scope, dependencies: [work.image, failed], revertOnUpdate: true },
  );

  return (
    <section
      ref={scope}
      aria-labelledby="museum-passage-title"
      className="relative museum-motion:h-[var(--passage-mobile-height,var(--passage-scroll))] museum-motion:lg:h-[var(--passage-scroll-desktop)]"
      style={{
        "--passage-scroll": `${passageMotion.scroll.mobile}svh`,
        "--passage-scroll-desktop": `${passageMotion.scroll.desktop}svh`,
      }}
    >
      <div
        data-passage-stage
        className="relative mx-auto grid max-w-[2000px] content-center items-center gap-7 px-5 py-12 lg:py-20 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-[clamp(20px,2.5vw,48px)] lg:px-[3vw] museum-motion:sticky museum-motion:top-20 museum-motion:lg:top-0 museum-motion:lg:h-svh museum-motion:overflow-clip museum-motion:pt-5 museum-motion:pb-8 museum-motion:lg:pb-6 museum-motion:max-lg:grid-rows-[auto_auto] museum-motion:max-lg:content-start museum-motion:max-lg:gap-y-5 museum-motion:lg:pt-[104px]"
      >
        <h2
          id="museum-passage-title"
          className="flex items-start justify-between gap-6 font-medium leading-[1.02] tracking-[-.045em] lg:contents museum-motion:max-lg:row-start-1 museum-motion:max-lg:self-end"
        >
          <span
            data-passage-opening
            className="block text-[clamp(30px,7vw,46px)] lg:col-start-1 lg:row-start-1 lg:mt-[10svh] lg:self-start lg:justify-self-end lg:text-right lg:text-[clamp(28px,3.5vw,60px)]"
          >
            <span data-passage-opening-arrival className="block">
              <span className="mb-2 block text-[clamp(16px,1.4vw,22px)] font-normal leading-normal tracking-normal text-muted">
                {passageContent.opening.cue}
              </span>
              {passageContent.opening.text}
            </span>
          </span>
          <span
            data-passage-ending
            className="block text-right text-[clamp(30px,7vw,46px)] lg:col-start-3 lg:row-start-1 lg:mb-[13svh] lg:self-end lg:text-left lg:text-[clamp(28px,3.5vw,60px)]"
          >
            <span className="mb-2 block text-[clamp(16px,1.4vw,22px)] font-normal leading-normal tracking-normal text-muted">
              {passageContent.ending.cue}
            </span>
            {passageContent.ending.text}
          </span>
        </h2>
        <figure
          data-passage-figure
          className="mx-auto w-full max-w-[720px] origin-center lg:col-start-2 lg:row-start-1 lg:w-[min(56vw,calc(100svh_-_210px),920px)] museum-motion:max-w-[min(90vw,calc(100svh_-_290px))] museum-motion:max-lg:row-start-2 museum-motion:lg:max-w-[920px]"
        >
          <TransitionLink
            href={`/oeuvres/${work.slug}`}
            aria-label={`${work.title} — ${work.artist}, ${work.year}`}
            className="relative block"
          >
            <div
              data-passage-frame
              className="relative overflow-hidden"
              style={{ aspectRatio: passageContent.ratio }}
            >
              {failed ? (
                <p className="flex h-full items-center justify-center text-center text-[14px] text-muted">
                  Reproduction momentanément indisponible
                </p>
              ) : (
                <div data-passage-image className="absolute inset-0">
                  <Media
                    src={work.image}
                    alt={work.title}
                    objectFit="contain"
                    loading="lazy"
                    sizes={sizes}
                    onError={() => setFailedSrc(work.image)}
                  />
                </div>
              )}
              <canvas
                data-passage-ink
                aria-hidden="true"
                tabIndex={-1}
                className="pointer-events-none absolute inset-0 size-full opacity-0"
              />
            </div>
          </TransitionLink>
          <figcaption
            data-passage-caption
            className="mt-4 text-center leading-[1.4] lg:mt-5"
          >
            <span className="block text-[16px] font-medium lg:text-[clamp(18px,1.3vw,22px)]">
              {work.title}
            </span>
            <span className="mt-1 block text-[14px] text-muted">
              {work.artist} · {work.year}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
