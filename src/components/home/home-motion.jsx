"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function HomeMotion({ children }) {
  const scope = useRef(null);
  const first = useMuseumStore((state) => state.isFirstRender);
  const initialVisit = useRef(first);
  const transition = useMuseumStore((state) => state.isTransitionActive);
  const [ready, setReady] = useState(!first);
  useEffect(() => {
    if (!first && !transition) setReady(true);
  }, [first, transition]);
  useGSAP(
    () => {
      if (!ready) return;
      const markHeroReady = () => {
        scope.current.dataset.heroReady = "true";
      };
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: reduce)", markHeroReady);
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (!initialVisit.current) {
          gsap.set("[data-hero-line]", {
            yPercent: 0,
            rotateX: 0,
            autoAlpha: 1,
          });
          gsap.set(".home-cover-work", { clipPath: "inset(0% 0% 0% 0%)" });
          markHeroReady();
        } else
          gsap
            .timeline({ onComplete: markHeroReady })
            .fromTo(
              "[data-hero-line]",
              { yPercent: 110, rotateX: -35, autoAlpha: 0 },
              {
                yPercent: 0,
                rotateX: 0,
                autoAlpha: 1,
                duration: 1.25,
                stagger: 0.12,
                ease: "museum",
              },
            )
            .fromTo(
              ".home-cover-work",
              { clipPath: "inset(12% 0% 12% 100%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.45,
                ease: "museum",
              },
              0.2,
            );
        gsap.to(".home-cover-work .artwork-image", {
          yPercent: -7,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        gsap.to(".home-cover-title", {
          y: -45,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
      return () => media.revert();
    },
    { scope, dependencies: [ready], revertOnUpdate: true },
  );
  return (
    <div
      ref={scope}
      className="home-motion motion-safe:[&_[data-hero-line]]:invisible motion-safe:[&_[data-hero-line]]:opacity-0"
    >
      {children}
    </div>
  );
}
