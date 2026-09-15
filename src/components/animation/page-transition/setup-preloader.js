import { gsap } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
import { exitPreloader } from "./preloader-exit";
import { drawPreloaderLogo } from "./preloader-logo";
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
