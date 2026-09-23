import { gsap, ScrollTrigger } from "@/lib/gsap";

export function softenStickyEdges(root, stage, top = () => 0) {
  const setY = gsap.quickSetter(stage, "y", "px");
  let start = 0;
  let end = 0;
  let radius = 1;
  const correction = (distance) => {
    if (Math.abs(distance) >= radius) return 0;
    return (radius - Math.abs(distance)) ** 2 / (4 * radius);
  };
  const update = (self) => {
    const scroll = self.scroll();
    // Blend the native sticky velocity at both edges, without adding inertia.
    setY(correction(scroll - start) - correction(end - scroll));
  };
  const trigger = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onRefresh: (self) => {
      start = self.start + window.innerHeight - top();
      end = self.end - stage.clientHeight - top();
      radius = Math.max(
        1,
        Math.min(96, stage.clientHeight * 0.12, (end - start) / 4),
      );
      update(self);
    },
    onUpdate: update,
  });
  return () => {
    trigger.kill();
    gsap.set(stage, { clearProps: "transform" });
  };
}
