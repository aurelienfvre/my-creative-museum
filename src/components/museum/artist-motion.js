import { gsap } from "@/lib/gsap";

const smoothMotion = (progress) =>
  progress ** 3 * (progress * (progress * 6 - 15) + 10);

export function animateArtistChapters(root) {
  const chapters = root.querySelectorAll("[data-chapter]");
  const pause = root.querySelector('[data-chapter-message="pause"]');
  const ending = root.querySelector('[data-chapter-message="ending"]');
  const height = () => root.querySelector("[data-artists-stage]").clientHeight;
  const layouts = [];
  const timeline = gsap.timeline({
    onUpdate: () =>
      layouts.forEach((layout) => {
        layout.render();
      }),
    defaults: { ease: smoothMotion },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      invalidateOnRefresh: true,
      onRefresh: () =>
        layouts.forEach((layout) => {
          layout.measure();
        }),
    },
  });
  chapters.forEach((chapter, index) => {
    const title = chapter.querySelector("[data-chapter-title]");
    const painter = chapter.querySelector("h2");
    const pictures = chapter.querySelector("[data-chapter-pictures]");
    const layout = createTitleLayout(title, pictures, height);
    layouts.push(layout);
    const painterOffset = () =>
      Math.min(
        0,
        pictures.offsetTop +
          pictures.offsetHeight +
          Math.max(24, height() * 0.035) -
          painter.offsetTop,
      );
    const painterExit = () => {
      const picturesTop = pictures.getBoundingClientRect().top;
      const imageBottom = Math.max(
        ...Array.from(
          pictures.querySelectorAll(".artwork-image"),
          (image) => image.getBoundingClientRect().bottom - picturesTop,
        ),
      );
      return (
        pictures.offsetTop +
        imageBottom -
        painter.offsetTop -
        height() -
        Math.min(24, height() * 0.02)
      );
    };
    const start = index ? 2.05 : 0;
    if (index)
      timeline.fromTo(
        chapter,
        { y: () => height(), autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55 },
        start,
      );
    const move = start + (index ? 0.42 : 0.08);
    timeline
      .fromTo(
        layout.motion,
        { scale: 1 },
        {
          scale: () =>
            Math.max(0.42, 28 / parseFloat(getComputedStyle(title).fontSize)),
          duration: 0.72,
        },
        move,
      )
      .fromTo(
        painter,
        {
          scale: () =>
            Math.max(0.3, 28 / parseFloat(getComputedStyle(painter).fontSize)),
          y: () => Math.min(48, height() * 0.055),
        },
        {
          scale: 1,
          y: painterOffset,
          duration: 0.72,
        },
        move,
      )
      .to(layout.motion, { y: () => -height(), duration: 0.8 }, move + 0.72)
      .to(pictures, { y: () => -height(), duration: 0.8 }, move + 0.78)
      .to(painter, { y: painterExit, duration: 0.86 }, move + 0.72);
  });
  timeline
    .fromTo(
      pause,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.28 },
      1.5,
    )
    .to(pause, { y: () => -height(), duration: 0.6 }, 1.93)
    .fromTo(
      ending,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.32 },
      3.88,
    );
  return timeline;
}

function createTitleLayout(title, pictures, height) {
  const motion = { scale: 1, y: 0 };
  let titleHeight = 0,
    titleTop = 0,
    picturesTop = 0,
    gap = 24;
  const layout = {
    motion,
    measure() {
      titleHeight = title.offsetHeight;
      titleTop = title.offsetTop;
      picturesTop = pictures.offsetTop;
      gap = Math.max(24, height() * 0.035);
    },
    render() {
      gsap.set(title, {
        scale: motion.scale,
        y: picturesTop - titleTop - titleHeight * motion.scale - gap + motion.y,
      });
    },
  };
  layout.measure();
  layout.render();
  return layout;
}
