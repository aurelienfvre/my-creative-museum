import { gsap } from "@/lib/gsap";
export function exitPreloader(preloader, reduced, unlock) {
  gsap
    .timeline({
      onComplete: () => {
        gsap.set(preloader.current, { autoAlpha: 0 });
        unlock();
      },
    })
    .to(".preloader-signature", {
      opacity: 0,
      y: reduced ? 0 : -12,
      duration: reduced ? 0 : 0.3,
    })
    .to(
      preloader.current,
      {
        yPercent: reduced ? 0 : -100,
        duration: reduced ? 0 : 0.8,
        ease: "curtain",
      },
      reduced ? 0 : "-=0.05",
    );
}
