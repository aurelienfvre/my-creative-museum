import { gsap } from "@/lib/gsap";
import { createGalleryCaptionSync } from "./gallery-captions";

export function startScrollGallery(root) {
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
  const syncActive = createGalleryCaptionSync(
    timeline,
    slides,
    captions,
    counters,
  );
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
}
