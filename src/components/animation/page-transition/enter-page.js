import { gsap } from "@/lib/gsap";
export function enterPage(refs, content, header, pageLayers, finishNavigation) {
  refs.navigationPhase.current = "entering";
  window.scrollTo({ top: 0, behavior: "instant" });
  gsap.set(content, {
    autoAlpha: 1,
    transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
  });
  if (refs.transitionKind.current === "page" && header) {
    gsap.set(header, {
      autoAlpha: 1,
      transformOrigin: `50% ${window.innerHeight / 2}px`,
    });
  }
  if (refs.transitionKind.current === "artwork-return") {
    refs.navigationTimeline.current = gsap
      .timeline({ onComplete: finishNavigation })
      .to(refs.artworkSnapshot.current, {
        y: window.innerHeight,
        duration: 0.8,
        ease: "museum",
      });
    return;
  }
  if (refs.transitionKind.current === "artwork") {
    refs.navigationTimeline.current = gsap
      .timeline({ onComplete: finishNavigation })
      .fromTo(
        content,
        { y: window.innerHeight },
        { y: 0, duration: 0.85, ease: "museum" },
      );
    return;
  }
  refs.navigationTimeline.current = gsap
    .timeline({ onComplete: finishNavigation })
    .to(refs.transitionLogo.current.querySelectorAll(".logo-stroke"), {
      strokeDashoffset: (_index, path) => -(path.getTotalLength() + 4),
      delay: 0.25,
      duration: 0.55,
      stagger: { each: 0.08, from: "end" },
      ease: "power2.inOut",
    })
    .set(refs.transitionLogo.current, { autoAlpha: 0 })
    .to(pageLayers, { xPercent: 0, duration: 0.85, ease: "curtain" })
    .to(pageLayers, {
      scale: 1,
      borderRadius: 0,
      duration: 0.45,
      ease: "curtain",
    });
}
