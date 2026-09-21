import { gsap } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
export function setupPreloader(refs, contextSafe) {
  if (!useMuseumStore.getState().isFirstRender) return;
  let disposed = false;
  let exiting = false;
  let emergency;
  const content = refs.scope.current.querySelector(".site-content");
  content.inert = true;
  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  const unlock = () => {
    clearTimeout(emergency);
    content.inert = false;
    document.documentElement.style.overflow = previousOverflow;
    useMuseumStore.getState().setIsFirstRender(false);
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const exit = contextSafe(() => {
    if (disposed || exiting) return;
    exiting = true;
    useMuseumStore.getState().setIsFirstRender(false);
    exitPreloader(refs.preloader, reduced, unlock);
  });
  const logo = drawPreloaderLogo(reduced);
  const hero = content.querySelector('[data-primary-media="true"]');
  const assets = Promise.allSettled([
    document.fonts.ready,
    hero?.decode?.() || Promise.resolve(),
  ]);
  const minimum = new Promise((resolve) => {
    logo.eventCallback("onComplete", resolve);
    if (reduced) resolve();
  });
  const timeout = setTimeout(() => {
    exit();
  }, 3500);
  Promise.all([assets, minimum]).then(() => {
    if (!disposed) {
      clearTimeout(timeout);
      exit();
    }
  });
  emergency = setTimeout(
    contextSafe(() => {
      if (!disposed) {
        gsap.set(refs.preloader.current, { autoAlpha: 0 });
        unlock();
      }
    }),
    6000,
  );
  return () => {
    disposed = true;
    clearTimeout(timeout);
    clearTimeout(emergency);
    content.inert = false;
    document.documentElement.style.overflow = previousOverflow;
  };
}

function exitPreloader(preloader, reduced, unlock) {
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

function drawPreloaderLogo(reduced) {
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
