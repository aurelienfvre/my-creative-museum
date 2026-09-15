"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function SmoothScroll() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
        prevent: (node) => Boolean(node.closest("dialog,[data-lenis-prevent]")),
      });
      const tick = (time) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Stoppe aussi l'inertie déjà lancée quand un volet ou une transition s'ouvre.
      const syncLock = () => {
        const state = useMuseumStore.getState();
        const locked =
          state.isFirstRender ||
          state.isTransitionActive ||
          document.documentElement.style.overflow === "hidden" ||
          Boolean(document.querySelector("dialog[open]"));
        if (locked && !lenis.isStopped) lenis.stop();
        else if (!locked && lenis.isStopped) {
          lenis.resize();
          lenis.start();
        }
      };
      const observer = new MutationObserver(syncLock);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style"],
      });
      for (const dialog of document.querySelectorAll("dialog")) {
        observer.observe(dialog, {
          attributes: true,
          attributeFilter: ["open"],
        });
      }
      const unsubscribe = useMuseumStore.subscribe(syncLock);
      syncLock();
      return () => {
        observer.disconnect();
        unsubscribe();
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      };
    });
    return () => media.revert();
  });
  return null;
}
