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
        duration: 1.25,
        ease: "none",
      },
      0,
    )
    .to(
      root.querySelector("[data-art-stream]"),
      { autoAlpha: 0, duration: 0.2 },
      1.05,
    );
  for (const [selector, enter, leave] of [
    ["[data-story-detail]", 0.3, 1.05],
    ["[data-story-perspective]", 1.98, 2.5],
  ]) {
    const text = root.querySelector(selector);
    timeline.fromTo(
      text,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.16, ease: "sine.out" },
      enter,
    );
    if (leave !== null)
      timeline.to(
        text,
        { autoAlpha: 0, y: -18, duration: 0.16, ease: "sine.in" },
        leave,
      );
  }
  // The caption clears before the portrait expands again when scrolling back.
  timeline.fromTo(
    root.querySelector("[data-story-ending]"),
    {
      autoAlpha: 0,
      y: () => root.querySelector("section").clientHeight * 0.16,
    },
    { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
    "portrait-settled",
  );
}
