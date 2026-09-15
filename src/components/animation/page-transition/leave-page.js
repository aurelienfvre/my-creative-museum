import { gsap } from "@/lib/gsap";
export function leavePage(refs, header, href, router) {
  gsap.set(refs.transitionLogo.current, { autoAlpha: 0, y: 8, scale: 0.94 });
  const strokes = refs.transitionLogo.current.querySelectorAll(".logo-stroke");
  // Longueurs SVG réelles : les valeurs normalisées à 1 sont trop petites
  // pour une interpolation CSS fiable des traits avec GSAP.
  gsap.set(strokes, {
    strokeDasharray: (_index, path) => path.getTotalLength() + 4,
    strokeDashoffset: (_index, path) => path.getTotalLength() + 4,
  });
  gsap.set(refs.contentRef.current, {
    transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
    overflow: "hidden",
  });
  const pageLayers = [refs.artworkSnapshot.current, header].filter(Boolean);
  refs.navigationTimeline.current = gsap
    .timeline({
      onComplete: () => {
        refs.navigationPhase.current = "waiting";
        gsap.set(pageLayers, { autoAlpha: 0 });
        refs.artworkSnapshot.current.hidden = true;
        router.push(href);
      },
    })
    .to(pageLayers, {
      scale: 0.92,
      borderRadius: 12,
      duration: 0.42,
      ease: "curtain",
    })
    .to(pageLayers, {
      xPercent: -110,
      duration: 0.75,
      ease: "curtain",
    })
    .to(refs.transitionLogo.current, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "museum",
    })
    .to(
      strokes,
      {
        strokeDashoffset: 0,
        duration: 1.15,
        stagger: 0.18,
        ease: "power2.inOut",
      },
      "-=0.15",
    );
}
