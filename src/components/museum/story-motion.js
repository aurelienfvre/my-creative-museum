import { streamPlanes } from "./data";
import { introMotion, museumMotion } from "./motion.config";

export function animateMuseumStory(timeline, root) {
  const { stream, story, settle, ending } = introMotion;
  timeline
    .fromTo(
      root.querySelectorAll("[data-art-stream]"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: stream.enterDuration },
      stream.enterAt,
    )
    .fromTo(
      root.querySelectorAll("[data-stream-art]"),
      { y: 0 },
      {
        y: (_, element) =>
          -root.querySelector("section").clientHeight *
          streamPlanes[Number(element.dataset.depth)].scrollTravel,
        duration: stream.moveDuration,
        ease: "none",
      },
      0,
    )
    .fromTo(
      root.querySelectorAll("[data-stream-art]"),
      { x: 0 },
      {
        x: (_, element) => {
          const plane = streamPlanes[Number(element.dataset.depth)];
          const width = root.clientWidth;
          const side = Number(element.dataset.side);
          const mobile = width < 1024;
          const margin = width * (mobile ? 0.01 : 0.04);
          const available =
            side < 0
              ? element.offsetLeft - margin
              : width - element.offsetLeft - element.offsetWidth - margin;
          const travel = width * (mobile ? 0.045 : plane.exitTravel);
          return side * Math.min(travel, Math.max(0, available));
        },
        duration: stream.moveDuration,
        ease: museumMotion.ease,
      },
      0,
    )
    .to(
      root.querySelectorAll("[data-art-stream]"),
      { autoAlpha: 0, duration: stream.leaveDuration },
      stream.leaveAt,
    );
  for (const [selector, { enter, leave }] of [
    ["[data-story-detail]", story.detail],
    ["[data-story-perspective]", story.perspective],
  ]) {
    const text = root.querySelector(selector);
    timeline.fromTo(
      text,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: story.enterDuration,
        ease: museumMotion.ease,
      },
      enter,
    );
    if (leave !== null)
      timeline.to(
        text,
        {
          autoAlpha: 0,
          y: -28,
          duration: story.leaveDuration,
          ease: museumMotion.ease,
        },
        leave,
      );
  }
  // The caption clears before the portrait expands again when scrolling back.
  timeline.fromTo(
    root.querySelector("[data-story-ending]"),
    {
      autoAlpha: 0,
      y: () => root.querySelector("section").clientHeight * 0.09,
    },
    { autoAlpha: 1, y: 0, duration: ending.duration, ease: museumMotion.ease },
    settle.label,
  );
}
