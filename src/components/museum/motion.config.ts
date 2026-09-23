// Times are positions/durations on scrubbed GSAP timelines, not scroll delays.
export const museumMotion = {
  ease: "sine.inOut",
  scrub: 0.25,
  rebuildDelay: 0.15,
  // Keep these queries aligned with the Tailwind variants in globals.css.
  media: {
    intro: "(prefers-reduced-motion: no-preference)",
    chapters:
      "(prefers-reduced-motion: no-preference) and (min-height: 540px) and ((min-width: 1024px) or (orientation: portrait))",
  },
} as const;

export const introMotion = {
  scroll: { mobile: 440, desktop: 580 },
  copyExit: 0.38,
  expand: { at: 0.88, duration: 0.9 },
  settle: { at: 2.38, duration: 1.15, label: "portrait-settled" },
  ending: { duration: 0.38, hold: 0.18 },
  stream: {
    enterAt: 0.02,
    enterDuration: 0.15,
    moveDuration: 1.16,
    leaveAt: 0.96,
    leaveDuration: 0.2,
  },
  story: {
    detail: { enter: 0.35, leave: 0.74 },
    perspective: { enter: 1.66, leave: 2.13 },
    enterDuration: 0.26,
    leaveDuration: 0.24,
  },
  pointer: { duration: 0.9, ease: "power3.out" },
  resizeDelay: 0.2,
} as const;

export const artistMotion = {
  scroll: { withReflection: 140, withoutReflection: 70 },
  chapterInterval: 2.45,
  enter: { duration: 0.48, ease: "power2.out" },
  exchange: { delay: 0.2, duration: 1.05, stagger: 0.04 },
  exit: { at: 1.14, duration: 0.9, stagger: 0.04 },
  message: {
    enterAt: 1.72,
    enterDuration: 0.28,
    leaveAt: 2.08,
    leaveDuration: 0.48,
  },
} as const;

export const passageMotion = {
  scroll: { mobile: 185, desktop: 215 },
  enter: { duration: 0.68, ease: "power2.out" },
  print: { at: 0.3, duration: 1.44 },
  notes: {
    opening: { enter: 0.12, leave: 0.66 },
    ending: { enter: 0.66, leave: 1.68 },
    enterDuration: 0.36,
    leaveDuration: 0.36,
  },
  caption: { at: 1.8, duration: 0.24 },
  hold: 0.24,
  light: { damping: 8, width: 0.18, intensity: 0.5 },
} as const;
