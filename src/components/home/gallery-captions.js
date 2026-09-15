import { gsap } from "@/lib/gsap";

export function createGalleryCaptionSync(timeline, slides, captions, counters) {
  let lastActive = -1;
  const syncActive = () => {
    const time = timeline.time();
    captions.forEach((caption, index) => {
      const enter =
        index === 0
          ? 1
          : gsap.utils.clamp(0, 1, (time - ((index - 1) * 1.35 + 0.75)) / 0.28);
      const leave =
        index === captions.length - 1
          ? 0
          : gsap.utils.clamp(0, 1, (time - (index * 1.35 + 0.75)) / 0.22);
      for (const element of [caption, counters[index]]) {
        element.style.transform = `translateY(${110 * (1 - enter - leave)}%)`;
        element.style.opacity = String(enter * (1 - leave));
        element.style.visibility =
          enter * (1 - leave) > 0 ? "visible" : "hidden";
      }
    });
    const active = Math.min(
      slides.length - 1,
      Math.max(0, Math.floor((timeline.time() - 0.75) / 1.35) + 1),
    );
    if (active !== lastActive) {
      slides.forEach((slide, index) => {
        slide.inert = index !== active;
        slide.style.pointerEvents = index === active ? "auto" : "none";
      });
      lastActive = active;
    }
  };

  return syncActive;
}
