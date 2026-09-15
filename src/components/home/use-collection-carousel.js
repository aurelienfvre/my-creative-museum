"use client";
import { gsap, useGSAP } from "@/lib/gsap";
import { startCarousel } from "./carousel-runtime";

export function useCollectionCarousel(scope, works, setActiveIndex) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (works.length < 2) return;
          return startCarousel(scope.current, works, setActiveIndex);
        },
      );
      return () => media.revert();
    },
    {
      scope,
      dependencies: [works.map((work) => work.slug).join("|")],
      revertOnUpdate: true,
    },
  );
}
