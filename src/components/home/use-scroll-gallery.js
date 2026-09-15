"use client";
import { gsap, useGSAP } from "@/lib/gsap";
import { startScrollGallery } from "./gallery-runtime";

export function useScrollGallery(scope, works) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () =>
        startScrollGallery(scope.current),
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
