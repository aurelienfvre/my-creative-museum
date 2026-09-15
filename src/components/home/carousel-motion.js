import { gsap } from "@/lib/gsap";

export function createCarouselMotion(root, state, works, step, render) {
  const bend = gsap.quickTo(state, "velocity", {
    duration: 0.7,
    ease: "power3.out",
    onUpdate: render,
  });
  const travel = gsap.to(state, {
    angle: -(works.length - 1) * step,
    ease: "none",
    onUpdate: render,
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) =>
        bend(gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / 1800)),
      onScrubComplete: () => bend(0),
      onLeave: () => bend(0),
      onLeaveBack: () => bend(0),
    },
  });

  return travel;
}
