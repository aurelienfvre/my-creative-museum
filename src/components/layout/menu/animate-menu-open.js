import { gsap } from "@/lib/gsap";

export default function animateMenuOpen(dialog, busy, reduced) {
  gsap
    .timeline({
      onComplete: () => {
        busy.current = false;
      },
    })
    .fromTo(
      dialog.current,
      { xPercent: 105 },
      { xPercent: 0, duration: reduced() ? 0 : 0.8, ease: "curtain" },
    )
    .fromTo(
      ".menu-link-word",
      { yPercent: 115, rotation: 5 },
      {
        yPercent: 0,
        rotation: 0,
        stagger: reduced() ? 0 : 0.075,
        duration: reduced() ? 0 : 0.75,
        ease: "museum",
      },
      reduced() ? 0 : 0.3,
    )
    .fromTo(
      ".menu-aside",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: reduced() ? 0 : 0.5 },
      reduced() ? 0 : 0.5,
    );
}
