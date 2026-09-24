"use client";
import { useEffect, useRef } from "react";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { animateMuseumIntro, loadMuseumImage } from "./intro-motion";
import { introMotion, museumMotion } from "./motion.config";
import { introContent, streamPlanes } from "./museum-content";

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
      className="group relative museum-intro:h-[var(--intro-height)] museum-intro:lg:h-[var(--intro-desktop-height)] museum-intro:max-lg:mb-[var(--intro-tail,0px)]"
      style={{
        "--intro-height": `${introMotion.scroll.mobile}svh`,
        "--intro-desktop-height": `${introMotion.scroll.desktop}svh`,
      }}
    >
      <section
        data-full-frame
        className="page-gutter relative pb-8 museum-intro:sticky museum-intro:top-0 museum-intro:h-svh museum-intro:overflow-hidden museum-intro:pb-0 lg:pb-0 motion-reduce:min-h-[90svh]"
      >
        <div
          data-landing-frame
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-x-0 mx-auto top-[7%] w-[min(64vw,34.4svh)] h-[43svh] lg:mx-0 lg:right-auto lg:left-[10%] lg:top-[12%] lg:w-[38%] lg:h-[76%]"
        />
        <canvas
          role="img"
          tabIndex={-1}
          aria-hidden="true"
          aria-label={portrait.title}
          className="pointer-events-none absolute inset-0 z-10 size-full opacity-0 group-data-[webgl=ready]:opacity-100"
        />
        <MuseumStory works={works} />
        <h1 className="pt-6 lg:pt-[4svh] text-[min(15vw,12svh)] lg:text-[clamp(64px,min(14vw,24svh),360px)] leading-[.95] tracking-[-.075em] text-foreground">
          {introContent.title}
          <span className="font-editorial">.</span>
        </h1>
        <p
          data-intro-copy
          className="relative mt-5 w-full max-w-[30ch] text-base leading-relaxed lg:absolute lg:mt-0 lg:w-auto lg:max-w-none lg:left-[70%] lg:right-[5%] lg:top-[61%] lg:text-[clamp(16px,min(1.6vw,2.6svh),30px)]"
        >
          {introContent.opening}
          <br />
          <span className="text-muted">{introContent.description}</span>
        </p>
        <div className="contents">
          <figure
            data-portrait
            className="relative z-10 mx-auto mt-6 aspect-[4/5] w-full max-w-md museum-intro:max-lg:w-[min(calc((100svh_-_20rem)*.8),calc(100vw_-_40px))] lg:absolute lg:m-0 lg:max-w-none lg:left-1/2 lg:-translate-x-1/2 lg:top-[36%] lg:w-[min(24vw,32svh)] lg:h-[min(30vw,40svh)]"
          >
            <ArtworkImage
              src={portrait.image}
              title={portrait.title}
              preload
              className="absolute inset-0 size-full group-data-[webgl=ready]:opacity-0"
              sizes="100vw"
            />
          </figure>
        </div>
      </section>
    </div>
  );
}

function MuseumStory({ works }) {
  const bySlug = new Map(works.map((work) => [work.slug, work]));
  return (
    <>
      {streamPlanes.map((plane, depth) => (
        <div
          key={plane.layer}
          data-art-stream
          data-depth={depth}
          aria-hidden="true"
          className={`pointer-events-none invisible absolute inset-0 opacity-0 motion-reduce:hidden ${plane.layer}`}
        >
          <div
            data-depth-plane
            className="absolute inset-0 will-change-transform"
          >
            {plane.works.map(({ slug, left, top }) => {
              const work = bySlug.get(slug);
              if (!work) return null;
              return (
                <div
                  key={work.slug}
                  data-stream-art
                  data-depth={depth}
                  data-side={left < 50 ? -1 : 1}
                  className="absolute w-[var(--mobile-width)] left-[var(--mobile-left)] lg:w-[var(--art-width)] lg:left-[var(--art-left)] will-change-transform"
                  style={{
                    "--art-width": plane.desktopWidth,
                    "--mobile-width": plane.mobileWidth,
                    "--mobile-left": `${left < 50 ? plane.mobileLeft : plane.mobileRight}%`,
                    "--art-left": `${left}%`,
                    top: `${top}%`,
                    opacity: plane.opacity,
                  }}
                >
                  <ArtworkImage
                    src={work.image}
                    title={work.title}
                    eager
                    contain
                    naturalRatio
                    className="aspect-[3/4] bg-transparent!"
                    sizes={`(max-width: 1023px) ${plane.mobileWidth}, ${plane.desktopWidth}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p
        data-story-detail
        className="pointer-events-none invisible absolute inset-x-[10%] top-[73%] text-[clamp(21px,6vw,26px)] lg:inset-x-[28%] lg:top-[82%] lg:text-[clamp(22px,min(2.5vw,3.4svh),44px)] motion-reduce:hidden z-20 text-center leading-tight tracking-tight text-foreground opacity-0"
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
        className="pointer-events-none invisible absolute inset-x-0 mx-auto w-[min(84vw,28rem)] top-[57%] lg:mx-0 lg:w-auto lg:left-[58%] lg:right-[7%] lg:top-[34%] z-20 opacity-0"
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
