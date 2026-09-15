"use client";
import { useRef } from "react";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ScrollGallery({ works }) {
  const scope = useRef(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        const slides = [...root.querySelectorAll(".scroll-work")];
        const captions = [...root.querySelectorAll(".scroll-caption")];
        const counters = [...root.querySelectorAll(".scroll-count")];
        if (slides.length < 2) return;
        root.classList.add("is-pinned-gallery");
        gsap.set(slides.slice(1), {
          clipPath: "inset(100% 0% 0% 0%)",
          pointerEvents: "none",
        });
        gsap.set(captions.slice(1), { yPercent: 110, autoAlpha: 0 });
        gsap.set(counters.slice(1), { yPercent: 110, autoAlpha: 0 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (slides.length - 1) * 1.15}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        slides.slice(1).forEach((slide, offset) => {
          const at = offset * 1.35 + 0.25;
          timeline.fromTo(
            slide,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "none",
              immediateRender: false,
            },
            at,
          );
        });
        // Keep both ends fully visible, including when scrubbing backwards.
        timeline.to({}, { duration: 0.25 });
        let lastActive = -1;
        const syncActive = () => {
          const time = timeline.time();
          captions.forEach((caption, index) => {
            const enter =
              index === 0
                ? 1
                : gsap.utils.clamp(
                    0,
                    1,
                    (time - ((index - 1) * 1.35 + 0.75)) / 0.28,
                  );
            const leave =
              index === captions.length - 1
                ? 0
                : gsap.utils.clamp(0, 1, (time - (index * 1.35 + 0.75)) / 0.22);
            for (const element of [caption, counters[index]]) {
              element.style.transform = `translateY(${110 * (1 - enter - leave)}%)`;
              element.style.opacity = String(enter * (1 - leave));
              element.style.visibility =
                enter * (1 - leave) > 0 ? "visible" : "hidden";
            }
          });
          const active = Math.min(
            slides.length - 1,
            Math.max(0, Math.floor((timeline.time() - 0.75) / 1.35) + 1),
          );
          if (active !== lastActive) {
            slides.forEach((slide, index) => {
              slide.inert = index !== active;
              slide.style.pointerEvents = index === active ? "auto" : "none";
            });
            lastActive = active;
          }
        };
        timeline.eventCallback("onUpdate", syncActive);
        syncActive();
        return () => {
          root.classList.remove("is-pinned-gallery");
          [...captions, ...counters].forEach((element) => {
            element.style.removeProperty("transform");
            element.style.removeProperty("opacity");
            element.style.removeProperty("visibility");
          });
          slides.forEach((slide) => {
            slide.inert = false;
            slide.style.removeProperty("pointer-events");
          });
        };
      });
      return () => media.revert();
    },
    {
      scope,
      dependencies: [works.map((work) => work.slug).join("|")],
      revertOnUpdate: true,
    },
  );
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
