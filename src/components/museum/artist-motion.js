import { gsap } from "@/lib/gsap";
import { createTitleLayout } from "./title-layout";

export function animateArtistChapters(root) {
  const chapters = root.querySelectorAll("[data-chapter]");
  const pause = root.querySelector('[data-chapter-message="pause"]');
  const ending = root.querySelector('[data-chapter-message="ending"]');
  const height = () => root.querySelector("[data-artists-stage]").clientHeight;
  const titleLayouts = [];
  const measure = () =>
    titleLayouts.forEach((item) => {
      item.measure();
    });
  const timeline = gsap.timeline({
    onUpdate: () =>
      titleLayouts.forEach((item) => {
        item.render();
      }),
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      invalidateOnRefresh: true,
      onRefresh: measure,
    },
  });
  chapters.forEach((chapter, index) => {
    const title = chapter.querySelector("[data-chapter-title]");
    const painter = chapter.querySelector("h2");
    const pictures = chapter.querySelector("[data-chapter-pictures]");
    const titleLayout = createTitleLayout(title, pictures, height);
    const titleMotion = titleLayout.motion;
    titleLayouts.push(titleLayout);
    const start = index ? 1.9 : 0;
    if (index)
      timeline.fromTo(
        chapter,
        { y: () => height(), autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out" },
        start,
      );
    const move = start + (index ? 0.3 : 0.08);
    const smallTitle = () =>
      Math.max(0.38, 30 / parseFloat(getComputedStyle(title).fontSize));
    timeline
      .fromTo(
        titleMotion,
        { scale: 1 },
        { scale: smallTitle, duration: 0.75 },
        move,
      )
      .to(
        titleMotion,
        { y: () => height() * 0.2 - title.offsetTop, duration: 0.5 },
        move,
      )
      .fromTo(painter, { scale: 0.25 }, { scale: 1, duration: 0.75 }, move)
      .fromTo(
        pictures,
        { y: () => height() * 0.04 },
        { y: () => -height() * 0.04, duration: 0.75 },
        move,
      )
      // Size exchange and upward departure overlap, as one continuous gesture.
      .to(
        titleMotion,
        { y: () => -height(), duration: 0.7, ease: "power2.in" },
        move + 0.52,
      )
      .to(
        pictures,
        { y: () => -height(), duration: 0.8, ease: "power2.in" },
        move + 0.55,
      )
      .to(
        painter,
        { y: () => -height(), duration: 0.7, ease: "power2.in" },
        move + 0.58,
      );
  });
  timeline
    .fromTo(
      pause,
      { autoAlpha: 0, scale: 0.92 },
      { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" },
      1.22,
    )
    .to(pause, { y: () => -height(), duration: 0.5, ease: "power2.in" }, 1.65)
    .fromTo(
      ending,
      { autoAlpha: 0, scale: 0.92 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" },
      3.35,
    );
  return timeline;
}
