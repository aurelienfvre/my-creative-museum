import { Flip } from "gsap/Flip";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { introMotion, museumMotion } from "./motion.config";
import { streamPlanes } from "./museum-content";
import { softenStickyEdges } from "./sticky-motion";
import { animateMuseumStory } from "./story-motion";

gsap.registerPlugin(Flip);
const imageEase = gsap.parseEase(museumMotion.ease);

export function animateMuseumIntro(root, contextSafe, motion) {
  const image = root.querySelector("[data-portrait] .artwork-image");
  const full = root.querySelector("[data-full-frame]");
  const landing = root.querySelector("[data-landing-frame]");
  const ending = root.querySelector("[data-story-ending]");
  const detail = root.querySelector("[data-story-detail]");
  const copy = root.querySelectorAll("h1, [data-intro-copy]");
  const { settle, expand } = introMotion;
  let timeline;
  const refresh = gsap.delayedCall(0.05, () => ScrollTrigger.refresh()).pause();
  const build = contextSafe(() => {
    const position = timeline?.scrollTrigger?.progress;
    timeline?.scrollTrigger?.kill();
    timeline?.revert();
    gsap.set(landing, { clearProps: "top,width,height" });
    gsap.set([ending, detail], { clearProps: "top" });
    gsap.set(ending, { clearProps: "width" });
    if (root.clientWidth < 1024) {
      const headerHeight =
        document.querySelector(".site-header")?.offsetHeight || 80;
      const top = headerHeight + 16;
      const width = root.clientWidth - 40;
      gsap.set(ending, { width });
      let height = Math.min(
        width / 0.8,
        Math.max(80, full.clientHeight - top - ending.offsetHeight - 48),
      );
      for (let pass = 0; pass < 3; pass++) {
        gsap.set(ending, { width: height * 0.8 });
        height = Math.min(
          width / 0.8,
          Math.max(80, full.clientHeight - top - ending.offsetHeight - 48),
        );
      }
      gsap.set(landing, { top, height, width: height * 0.8 });
      gsap.set(ending, { top: top + height + 24, width: height * 0.8 });
      const tail = `${-Math.max(0, full.clientHeight - top - height - ending.offsetHeight - 64)}px`;
      if (root.style.getPropertyValue("--intro-tail") !== tail) {
        root.style.setProperty("--intro-tail", tail);
        refresh.restart(true);
      }
      const portrait = root.querySelector("[data-portrait]");
      gsap.set(detail, {
        top: portrait.offsetTop + portrait.offsetHeight + 24,
      });
    }
    gsap.set(image, {
      transformOrigin: root.clientWidth < 1024 ? "0 0" : "50% 50%",
    });
    const initial = Flip.getState(image);
    const fit = { getVars: true, scale: root.clientWidth < 1024 };
    const expanded = Flip.fit(image, full, fit);
    const settled = Flip.fit(image, landing, fit);
    if (fit.scale) {
      const scale = Math.max(expanded.scaleX, expanded.scaleY);
      expanded.x -= ((scale - expanded.scaleX) * image.offsetWidth) / 2;
      expanded.y -= ((scale - expanded.scaleY) * image.offsetHeight) / 2;
      expanded.scaleX = expanded.scaleY = scale;
    }
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
        Flip.fit(image, initial, fit),
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
    root.style.removeProperty("--intro-tail");
    refresh.kill();
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
  const media = matchMedia(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  let generation = 0,
    dispose;
  const sync = () => {
    const current = ++generation;
    dispose?.();
    dispose = undefined;
    delete root.dataset.webgl;
    if (!media.matches) return;
    import("./museum-image-runtime")
      .then(({ startMuseumImage }) => {
        if (current === generation)
          dispose = startMuseumImage(root, src, motion);
      })
      .catch(() => {});
  };
  sync();
  media.addEventListener("change", sync);
  return () => {
    generation++;
    media.removeEventListener("change", sync);
    dispose?.();
    delete root.dataset.webgl;
  };
}
