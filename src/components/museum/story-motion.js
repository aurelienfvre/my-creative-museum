export function animateMuseumStory(timeline, root) {
  timeline
    .fromTo(
      root.querySelector("[data-art-stream]"),
      { autoAlpha: 0 },
      { autoAlpha: 0.9, duration: 0.15 },
      0,
    )
    .fromTo(
      root.querySelectorAll("[data-stream-art]"),
      { y: 0 },
      {
        y: () => -root.querySelector("section").clientHeight * 2.8,
        duration: 1.15,
        ease: "none",
      },
      0,
    )
    .to(
      root.querySelector("[data-art-stream]"),
      { autoAlpha: 0, duration: 0.2 },
      0.92,
    );
  for (const [selector, enter, leave] of [
    ["[data-story-detail]", 0.35, 0.86],
    ["[data-story-perspective]", 2.02, 2.4],
  ]) {
    const text = root.querySelector(selector);
    timeline.fromTo(
      text,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.26, ease: "sine.inOut" },
      enter,
    );
    if (leave !== null)
      timeline.to(
        text,
        { autoAlpha: 0, y: -28, duration: 0.24, ease: "sine.inOut" },
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
    { autoAlpha: 1, y: 0, duration: 0.38, ease: "sine.inOut" },
    "portrait-settled",
  );
}
