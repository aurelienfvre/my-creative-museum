"use client";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function GSAPWrapper({ children }) {
  const scope = useRef(null);
  const pathname = usePathname();
  const isFirstRender = useMuseumStore((state) => state.isFirstRender);
  useGSAP(
    () => {
      if (isFirstRender) return;
      const root = scope.current;
      root.dataset.motionReady = "true";
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        (_mediaContext, contextSafe) => {
          const initialized = new WeakSet();
          const setup = contextSafe(() => {
            const arrives = [...root.querySelectorAll("[data-arrive]")].filter(
              (element) => !initialized.has(element),
            );
            arrives.forEach((element) => {
              initialized.add(element);
            });
            if (arrives.length)
              gsap.fromTo(
                arrives,
                { yPercent: 20, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 1.05,
                  stagger: 0.07,
                  ease: "museum",
                  clearProps: "transform",
                },
              );
            let addedReveal = false;
            root.querySelectorAll("[data-reveal]").forEach((element) => {
              if (initialized.has(element)) return;
              initialized.add(element);
              addedReveal = true;
              gsap.fromTo(
                element,
                { y: 35, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 1.1,
                  ease: "museum",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 95%",
                    once: true,
                  },
                },
              );
            });
            // Pin refresh mutates spacer nodes. Only refresh for new animated content,
            // otherwise MutationObserver and ScrollTrigger feed each other forever.
            if (arrives.length || addedReveal) ScrollTrigger.refresh();
          });
          setup();
          // Les contenus streamés après loading.js reçoivent aussi leur animation.
          const observer = new MutationObserver(setup);
          observer.observe(root, { childList: true, subtree: true });
          return () => observer.disconnect();
        },
      );
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-arrive],[data-reveal]", {
          autoAlpha: 1,
          clearProps: "transform",
        });
      });
      return () => {
        media.revert();
        delete root.dataset.motionReady;
      };
    },
    { scope, dependencies: [pathname, isFirstRender], revertOnUpdate: true },
  );
  return (
    <div className="motion-scope" ref={scope} key={pathname}>
      {children}
    </div>
  );
}
