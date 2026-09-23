"use client";
import { useEffect, useRef } from "react";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { introContent, streamPlanes } from "./data";
import { animateMuseumIntro, loadMuseumImage } from "./intro-motion";
import { introMotion, museumMotion } from "./motion.config";

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
      media.add(museumMotion.media.intro, (_context, contextSafe) => {
        const setup = contextSafe(() =>
          animateMuseumIntro(scope.current, contextSafe, motion.current),
        );
        return setup();
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <div
      ref={scope}
      className="group relative min-h-svh motion-safe:h-[var(--intro-height)] motion-safe:lg:h-[var(--intro-desktop-height)]"
      style={{
        "--intro-height": `${introMotion.scroll.mobile}svh`,
        "--intro-desktop-height": `${introMotion.scroll.desktop}svh`,
      }}
    >
      <section
        data-full-frame
        className="page-gutter relative motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-hidden motion-reduce:min-h-[90svh]"
      >
        <div
          data-landing-frame
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-1/2 -translate-x-1/2 top-[7%] w-[min(64vw,34.4svh)] h-[43svh] lg:translate-x-0 lg:left-[10%] lg:top-[12%] lg:w-[38%] lg:h-[76%]"
        />
        <canvas
          role="img"
          tabIndex={-1}
          aria-hidden="true"
          aria-label={portrait.title}
          className="pointer-events-none absolute inset-0 z-10 size-full opacity-0 group-data-[webgl=ready]:opacity-100"
        />
        <MuseumStory works={works} />
        <h1 className="pt-[4svh] text-[15vw] lg:text-[clamp(64px,min(14vw,24svh),360px)] leading-[.95] tracking-[-.075em] text-foreground">
          {introContent.title}
          <span className="font-editorial">.</span>
        </h1>
        <div className="contents">
          <figure
            data-portrait
            className="absolute top-[28%] left-1/2 m-0 -translate-x-1/2 h-[min(34svh,72.5vw)] w-[27.2svh] max-w-[58vw] lg:top-[36%] lg:w-[min(24vw,32svh)] lg:h-[min(30vw,40svh)] lg:max-w-none"
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
            className="absolute left-[12%] right-[12%] top-[70%] text-[16px] leading-relaxed lg:left-[70%] lg:right-[5%] lg:top-[61%] lg:text-[clamp(16px,min(1.6vw,2.6svh),30px)]"
          >
            {introContent.opening}
            <br />
            <span className="text-muted">{introContent.description}</span>
          </p>
        </div>
      </section>
    </div>
  );
}

function MuseumStory({ works }) {
  return (
    <>
      {streamPlanes.map(({ desktop, mobile, opacity, layer }, plane) => (
        <div
          key={layer}
          data-art-stream
          data-depth={plane}
          aria-hidden="true"
          className={`pointer-events-none invisible absolute inset-0 opacity-0 motion-reduce:hidden ${layer}`}
        >
          <div
            data-depth-plane
            className="absolute inset-0 will-change-transform"
          >
            {works
              .filter((_, index) => index % streamPlanes.length === plane)
              .map((work, index) => (
                <div
                  key={work.slug}
                  data-stream-art
                  data-depth={plane}
                  className="absolute w-[var(--mobile-width)] left-[var(--mobile-left)] lg:w-[var(--art-width)] lg:left-[var(--art-left)] will-change-transform"
                  style={{
                    "--art-width": `${desktop.width}%`,
                    "--mobile-width": `${mobile.width}%`,
                    "--mobile-left": `${index % 2 ? mobile.right : mobile.left}%`,
                    "--art-left": `${index % 2 ? desktop.right : desktop.left}%`,
                    top: `${introMotion.stream.firstTop + (index * streamPlanes.length + plane) * introMotion.stream.spacing}%`,
                    opacity,
                  }}
                >
                  <ArtworkImage
                    src={work.image}
                    title={work.title}
                    eager
                    contain
                    className="aspect-[3/4] bg-transparent!"
                    sizes="(max-width: 1023px) 24vw, 28vw"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
      <p
        data-story-detail
        className="pointer-events-none invisible absolute inset-x-[10%] top-[73%] text-[26px] lg:inset-x-[28%] lg:top-[82%] lg:text-[clamp(22px,min(2.5vw,3.4svh),44px)] motion-reduce:hidden z-20 text-center leading-tight tracking-tight text-foreground opacity-0"
      >
        {introContent.detail.opening}
        <br />
        <em className="font-editorial">{introContent.detail.emphasis}</em>
      </p>
      <div
        data-story-perspective
        className="pointer-events-none invisible absolute left-[8%] bottom-[10%] w-[84%] lg:bottom-[12%] lg:w-[52%] z-20 text-white opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      >
        <p className="text-[clamp(26px,7vw,38px)] lg:text-[clamp(28px,min(4vw,6svh),80px)] leading-[1.04] tracking-tight">
          {introContent.perspective.opening}
          <br />
          <em className="font-editorial text-white!">
            {introContent.perspective.emphasis}
          </em>
        </p>
        <p className="mt-[clamp(16px,3svh,32px)] max-w-[36ch] text-[clamp(15px,min(1.5vw,2.2svh),24px)] leading-relaxed">
          {introContent.perspective.text}
        </p>
      </div>
      <div
        data-story-ending
        className="pointer-events-none invisible absolute left-[9%] right-[9%] top-[57%] lg:left-[58%] lg:right-[7%] lg:top-[34%] z-20 opacity-0"
      >
        <p className="text-[clamp(26px,7vw,38px)] lg:text-[clamp(28px,min(4vw,6svh),80px)] leading-[1.04] tracking-tight">
          {introContent.ending.opening}
          <br />
          {introContent.ending.prefix}{" "}
          <em className="font-editorial text-foreground">
            {introContent.ending.emphasis}
          </em>
        </p>
        <p className="mt-[clamp(16px,3svh,32px)] max-w-[36ch] text-[clamp(15px,min(1.5vw,2.2svh),24px)] leading-relaxed text-muted">
          {introContent.ending.text}
        </p>
      </div>
    </>
  );
}
