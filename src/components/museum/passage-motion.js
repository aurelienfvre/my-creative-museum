import { gsap, ScrollTrigger } from "@/lib/gsap";
import { museumMotion, passageMotion } from "./motion.config";
import { softenStickyEdges } from "./sticky-motion";

export function animateMuseumPassage(root, contextSafe) {
  const figure = root.querySelector("[data-passage-figure]");
  const image = root.querySelector("[data-passage-image] img");
  const canvas = root.querySelector("[data-passage-ink]");
  const opening = root.querySelector("[data-passage-opening]");
  const openingArrival = root.querySelector("[data-passage-opening-arrival]");
  const ending = root.querySelector("[data-passage-ending]");
  const caption = root.querySelector("[data-passage-caption]");
  const stage = root.querySelector("[data-passage-stage]");
  const refresh = gsap.delayedCall(0.05, () => ScrollTrigger.refresh()).pause();
  const fitMobileStage = () => {
    if (root.clientWidth >= 1024) return;
    const height = `${stage.clientHeight + window.innerHeight * (passageMotion.scroll.mobile / 100 - 1)}px`;
    if (root.style.getPropertyValue("--passage-mobile-height") === height)
      return;
    root.style.setProperty("--passage-mobile-height", height);
    refresh.restart(true);
  };
  const layout = new ResizeObserver(fitMobileStage);
  layout.observe(stage);
  layout.observe(figure);
  fitMobileStage();
  let ink;
  let disposed = false,
    loading = false,
    nearby = false;
  const motion = { progress: 0 };
  const dropInk = () => {
    ink?.dispose();
    ink = null;
  };
  const arrival = gsap.timeline({
    defaults: passageMotion.enter,
    scrollTrigger: {
      trigger: root,
      start: () => (root.clientWidth < 1024 ? "top 92%" : "top 80%"),
      end: () => (root.clientWidth < 1024 ? "top 60%" : "top top"),
      scrub: museumMotion.scrub,
      invalidateOnRefresh: true,
    },
  });
  arrival
    .fromTo(figure, { opacity: 0 }, { opacity: 1 }, 0)
    .fromTo(
      openingArrival,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: passageMotion.notes.enterDuration },
      passageMotion.notes.opening.enter,
    );
  const timeline = gsap.timeline({
    defaults: { ease: museumMotion.ease },
    onUpdate: () => ink?.render(motion.progress),
    scrollTrigger: {
      trigger: root,
      start: () => (root.clientWidth < 1024 ? "top 80px" : "top top"),
      end: () =>
        root.clientWidth < 1024
          ? `bottom ${stage.clientHeight + 80}px`
          : "bottom bottom",
      scrub: museumMotion.scrub,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(
      motion,
      { progress: 0 },
      { progress: 1, duration: passageMotion.print.duration, ease: "none" },
      passageMotion.print.at,
    )
    .fromTo(
      caption,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: passageMotion.caption.duration },
      passageMotion.caption.at,
    )
    .to(
      motion,
      { progress: 1, duration: passageMotion.hold },
      passageMotion.caption.at + passageMotion.caption.duration,
    )
    .fromTo(
      opening,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -28, duration: passageMotion.notes.leaveDuration },
      passageMotion.notes.opening.leave,
    )
    .fromTo(
      ending,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: passageMotion.notes.enterDuration },
      passageMotion.notes.ending.enter,
    )
    .to(
      ending,
      { opacity: 0, y: -28, duration: passageMotion.notes.leaveDuration },
      passageMotion.notes.ending.leave,
    );
  arrival.progress(arrival.scrollTrigger.progress);
  timeline.progress(timeline.scrollTrigger.progress);
  const releaseEdges = softenStickyEdges(root, stage, () =>
    root.clientWidth < 1024 ? 80 : 0,
  );

  const attachInk = contextSafe((createInkPassage, source) => {
    if (disposed) return;
    ink = createInkPassage(canvas, source, dropInk);
    ink?.render(motion.progress);
  });
  const ready = () => {
    if (
      disposed ||
      loading ||
      !nearby ||
      !image?.complete ||
      !image.naturalWidth
    )
      return;
    loading = true;
    // Decode the selected source independently of the responsive DOM image.
    const source = new Image();
    source.src = image.currentSrc;
    Promise.all([import("./passage-ink"), source.decode()])
      .then(([{ createInkPassage }]) => attachInk(createInkPassage, source))
      .catch(() => {
        if (!disposed) dropInk();
      });
  };
  const visibility = new IntersectionObserver(
    ([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) ready();
    },
    { rootMargin: "240px 0px" },
  );
  visibility.observe(figure);
  image?.addEventListener("load", ready);
  ready();
  return () => {
    disposed = true;
    visibility.disconnect();
    layout.disconnect();
    refresh.kill();
    root.style.removeProperty("--passage-mobile-height");
    releaseEdges();
    image?.removeEventListener("load", ready);
    arrival.scrollTrigger?.kill();
    arrival.revert();
    timeline.scrollTrigger?.kill();
    timeline.revert();
    dropInk();
  };
}
