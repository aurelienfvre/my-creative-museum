import { gsap } from "@/lib/gsap";
export function drawPreloaderLogo(reduced) {
  // Le panneau est déjà opaque dans le HTML serveur : rien ne clignote avant l’hydratation.
  gsap.set(".preloader .logo-stroke", {
    strokeDasharray: 1,
    strokeDashoffset: reduced ? 0 : 1,
  });
  const logo = gsap.timeline();
  logo
    .to(".preloader .logo-stroke", {
      strokeDashoffset: 0,
      stagger: reduced ? 0 : 0.13,
      duration: reduced ? 0 : 1.05,
      ease: "power2.inOut",
    })
    .fromTo(
      ".preloader-name",
      { opacity: 0, y: reduced ? 0 : 8 },
      { opacity: 1, y: 0, duration: reduced ? 0 : 0.5 },
      reduced ? 0 : 0.65,
    );

  return logo;
}
