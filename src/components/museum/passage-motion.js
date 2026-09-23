import { gsap } from "@/lib/gsap";
import { museumMotion, passageMotion } from "./motion.config";

export function animateMuseumPassage(root, contextSafe) {
  const figure = root.querySelector("[data-passage-figure]");
  const image = root.querySelector("[data-passage-image] img");
  const canvas = root.querySelector("[data-passage-ink]");
  const opening = root.querySelector("[data-passage-opening]");
  const openingArrival = root.querySelector("[data-passage-opening-arrival]");
  const ending = root.querySelector("[data-passage-ending]");
  const caption = root.querySelector("[data-passage-caption]");
  let ink;
  let disposed = false,
    loading = false;
  const motion = { progress: 0 };
  const dropInk = () => {
    ink?.dispose();
    ink = null;
  };
  const arrival = gsap.timeline({
    defaults: passageMotion.enter,
    scrollTrigger: {
      trigger: root,
      start: "top 80%",
      end: "top top",
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
      start: "top top",
      end: "bottom bottom",
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

  const attachInk = contextSafe((createInkPassage, source) => {
    if (disposed) return;
    ink = createInkPassage(canvas, source, dropInk);
    ink?.render(motion.progress);
  });
  const ready = () => {
    if (disposed || loading || !image?.complete || !image.naturalWidth) return;
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
  image?.addEventListener("load", ready);
  ready();
  return () => {
    disposed = true;
    image?.removeEventListener("load", ready);
    arrival.scrollTrigger?.kill();
    arrival.revert();
    timeline.scrollTrigger?.kill();
    timeline.revert();
    dropInk();
  };
}
