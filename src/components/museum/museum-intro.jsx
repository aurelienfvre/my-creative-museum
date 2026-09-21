"use client";
import { useEffect, useRef } from "react";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { animateMuseumIntro, loadMuseumImage } from "./intro-motion";

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
        className="page-gutter relative motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-hidden motion-reduce:min-h-[90svh]"
      >
        <div
          data-landing-frame
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-[20%] top-[8%] w-[60%] h-[46%] lg:left-[10%] lg:top-[12%] lg:w-[38%] lg:h-[76%]"
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
          Le musée<span className="font-editorial">.</span>
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

function MuseumStory({ works }) {
  return (
    <>
      <div
        data-art-stream
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 opacity-0 [perspective:1000px] motion-reduce:hidden"
      >
        {works.map((work, index) => (
          <div
            key={work.slug}
            data-stream-art
            className="absolute w-[19%] opacity-60 lg:w-[21%]"
            style={{
              left: `${index % 2 ? 77 : 2}%`,
              top: `${85 + index * 42}%`,
              transform: `translateZ(-140px) rotateY(${index % 2 ? -10 : 10}deg)`,
            }}
          >
            <ArtworkImage
              src={work.image}
              title={work.title}
              eager
              contain
              className="aspect-[3/4] bg-transparent!"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
      <p
        data-story-detail
        className="pointer-events-none invisible absolute inset-x-[10%] top-[73%] text-[26px] lg:inset-x-[28%] lg:top-[82%] lg:text-[clamp(22px,min(2.5vw,3.4svh),44px)] motion-reduce:hidden z-20 text-center leading-tight tracking-tight text-foreground opacity-0"
      >
        Des siècles d’art.
        <br />
        <em className="font-editorial">Votre regard.</em>
      </p>
      <div
        data-story-perspective
        className="pointer-events-none invisible absolute left-[8%] bottom-[10%] w-[84%] lg:bottom-[12%] lg:w-[52%] z-20 text-white opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      >
        <p className="text-[clamp(26px,7vw,38px)] lg:text-[clamp(28px,min(4vw,6svh),80px)] leading-[1.04] tracking-tight">
          Derrière chaque œuvre,
          <br />
          <em className="font-editorial text-white!">une histoire.</em>
        </p>
        <p className="mt-[clamp(16px,3svh,32px)] max-w-[36ch] text-[clamp(15px,min(1.5vw,2.2svh),24px)] leading-relaxed">
          Retrouvez son artiste, son époque et le musée qui conserve l’original.
        </p>
      </div>
      <div
        data-story-ending
        className="pointer-events-none invisible absolute left-[9%] right-[9%] top-[62%] lg:left-[58%] lg:right-[7%] lg:top-[34%] z-20 opacity-0"
      >
        <p className="text-[clamp(26px,7vw,38px)] lg:text-[clamp(28px,min(4vw,6svh),80px)] leading-[1.04] tracking-tight">
          Prenez le temps
          <br />
          de <em className="font-editorial text-foreground">voir.</em>
        </p>
        <p className="mt-[clamp(16px,3svh,32px)] max-w-[36ch] text-[clamp(15px,min(1.5vw,2.2svh),24px)] leading-relaxed text-muted">
          Un détail, une couleur, une émotion. Chaque visite commence par ce qui
          vous touche.
        </p>
      </div>
    </>
  );
}
