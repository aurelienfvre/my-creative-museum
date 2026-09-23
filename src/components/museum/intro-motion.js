import { Flip } from "gsap/Flip";
import { gsap } from "@/lib/gsap";
import { streamPlanes } from "./data";
import { introMotion, museumMotion } from "./motion.config";
import { softenStickyEdges } from "./sticky-motion";
import { animateMuseumStory } from "./story-motion";

gsap.registerPlugin(Flip);
const imageEase = gsap.parseEase(museumMotion.ease);

export function animateMuseumIntro(root, contextSafe, motion) {
  const image = root.querySelector("[data-portrait] .artwork-image");
  const full = root.querySelector("[data-full-frame]");
  const landing = root.querySelector("[data-landing-frame]");
  const copy = root.querySelectorAll("h1, [data-intro-copy]");
  const { settle, expand } = introMotion;
  let timeline;
  const build = contextSafe(() => {
    const position = timeline?.scrollTrigger?.progress;
    timeline?.scrollTrigger?.kill();
    timeline?.revert();
    gsap.set(landing, { clearProps: "top,width,height" });
    if (root.clientWidth < 1024) {
      const headerHeight =
        document.querySelector(".site-header")?.offsetHeight || 80;
      const top = Math.max(full.clientHeight * 0.07, headerHeight + 16);
      const endingTop = root.querySelector("[data-story-ending]").offsetTop;
      const height = Math.min(
        full.clientHeight * 0.43,
        root.clientWidth * 0.8,
        Math.max(80, endingTop - top - 24),
      );
      gsap.set(landing, { top, height, width: height * 0.8 });
    }
    const initial = Flip.getState(image);
    const expanded = Flip.fit(image, full, { getVars: true });
    const settled = Flip.fit(image, landing, { getVars: true });
    const copyExitY = -Math.max(
      ...[...copy].map(
        (element) => element.offsetTop + element.offsetHeight + 64,
      ),
    );
    timeline = gsap.timeline({
      onUpdate: () => {
        motion.progress = imageEase(
          gsap.utils.clamp(
            0,
            1,
            (timeline.time() - settle.at) / settle.duration,
          ),
        );
      },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: museumMotion.scrub,
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
          y: copyExitY,
          duration: introMotion.copyExit,
          ease: museumMotion.ease,
        },
        0,
      )
      .set(copy, { autoAlpha: 0 }, introMotion.copyExit)
      .fromTo(
        image,
        Flip.fit(image, initial, { getVars: true }),
        { ...expanded, duration: expand.duration, ease: museumMotion.ease },
        expand.at,
      )
      .to(
        image,
        { ...settled, duration: settle.duration, ease: museumMotion.ease },
        settle.at,
      )
      .addLabel(settle.label);
    animateMuseumStory(timeline, root);
    timeline.to({}, { duration: introMotion.ending.hold });
    timeline.progress(position ?? timeline.scrollTrigger.progress);
  });
  build();
  const releaseEdges = softenStickyEdges(root, full);
  const planes = [...root.querySelectorAll("[data-depth-plane]")];
  const moveX = planes.map((plane) =>
    gsap.quickTo(plane, "x", { ...introMotion.pointer }),
  );
  const moveY = planes.map((plane) =>
    gsap.quickTo(plane, "y", { ...introMotion.pointer }),
  );
  const pointer = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = full.getBoundingClientRect();
    planes.forEach((_, index) => {
      const distance = Math.min(
        streamPlanes[index].pointerTravel,
        rect.width * (rect.width < 1024 ? 0.015 : 0.06),
      );
      moveX[index](
        ((event.clientX - rect.left) / rect.width - 0.5) * -distance,
      );
      moveY[index](
        ((event.clientY - rect.top) / rect.height - 0.5) * -distance,
      );
    });
  };
  const resetPointer = () =>
    planes.forEach((_, index) => {
      moveX[index](0);
      moveY[index](0);
    });
  full.addEventListener("pointermove", pointer);
  full.addEventListener("pointerleave", resetPointer);
  // Re-measure only on viewport changes, never on scroll-trigger refreshes.
  const resize = gsap.delayedCall(introMotion.resizeDelay, build).pause();
  let frameWidth = full.clientWidth;
  let frameHeight = full.clientHeight;
  const onResize = () => {
    if (full.clientWidth === frameWidth && full.clientHeight === frameHeight)
      return;
    frameWidth = full.clientWidth;
    frameHeight = full.clientHeight;
    resetPointer();
    resize.restart(true);
  };
  window.addEventListener("resize", onResize);
  return () => {
    releaseEdges();
    window.removeEventListener("resize", onResize);
    resize.kill();
    full.removeEventListener("pointermove", pointer);
    full.removeEventListener("pointerleave", resetPointer);
    [...moveX, ...moveY].forEach((move) => {
      move.tween.kill();
    });
    timeline.scrollTrigger?.kill();
    timeline.revert();
  };
}

export function loadMuseumImage(root, src, motion) {
  if (!matchMedia(museumMotion.media.intro).matches) return;
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
