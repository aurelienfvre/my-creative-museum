import { Flip } from "gsap/Flip";
import { gsap } from "@/lib/gsap";
import { animateMuseumStory } from "./story-motion";

gsap.registerPlugin(Flip);
const imageEase = gsap.parseEase("sine.inOut");

export function animateMuseumIntro(root, contextSafe, motion) {
  const image = root.querySelector("[data-portrait] .artwork-image");
  const full = root.querySelector("[data-full-frame]");
  const landing = root.querySelector("[data-landing-frame]");
  const copy = root.querySelectorAll("h1, [data-intro-copy]");
  let timeline;
  const build = contextSafe(() => {
    const position = timeline?.scrollTrigger?.progress || 0;
    timeline?.scrollTrigger?.kill();
    timeline?.revert();
    const initial = Flip.getState(image);
    const expanded = Flip.fit(image, full, { getVars: true });
    const settled = Flip.fit(image, landing, { getVars: true });
    timeline = gsap.timeline({
      onUpdate: () => {
        motion.progress = imageEase(
          gsap.utils.clamp(0, 1, (timeline.time() - 2.7) / 1.35),
        );
      },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => {
          motion.velocity = gsap.utils.clamp(
            -0.6,
            0.6,
            self.getVelocity() / 2400,
          );
        },
      },
    });
    timeline
      .to(
        copy,
        {
          y: (_, element) => -(element.offsetTop + element.offsetHeight + 64),
          duration: 0.65,
          ease: "sine.inOut",
        },
        0,
      )
      .set(copy, { autoAlpha: 0 }, 0.65)
      .fromTo(
        image,
        Flip.fit(image, initial, { getVars: true }),
        { ...expanded, duration: 0.7, ease: "sine.inOut" },
        1.25,
      )
      .to(image, { ...settled, duration: 1.35, ease: "sine.inOut" }, 2.7)
      .addLabel("portrait-settled");
    animateMuseumStory(timeline, root);
    timeline.progress(position);
  });
  build();
  // Re-measure only on viewport changes, never on scroll-trigger refreshes.
  const resize = gsap.delayedCall(0.2, build).pause();
  const onResize = () => resize.restart(true);
  window.addEventListener("resize", onResize);
  return () => {
    window.removeEventListener("resize", onResize);
    resize.kill();
    timeline.scrollTrigger?.kill();
    timeline.revert();
  };
}

export function loadMuseumImage(root, src, motion) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let cancelled = false,
    dispose;
  import("./image-runtime")
    .then(({ startMuseumImage }) => {
      if (!cancelled) dispose = startMuseumImage(root, src, motion);
    })
    .catch(() => {});
  return () => {
    cancelled = true;
    dispose?.();
    delete root.dataset.webgl;
  };
}
