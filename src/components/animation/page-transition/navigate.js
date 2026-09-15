import { gsap } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
import { createSnapshot } from "./create-snapshot";
import { leavePage } from "./leave-page";
export function navigateTo(refs, href, router) {
  const store = useMuseumStore.getState();
  if (store.isTransitionActive || store.isFirstRender) return;
  if (
    new URL(href, window.location.href).pathname === window.location.pathname
  ) {
    router.push(href);
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    router.push(href);
    return;
  }
  const targetPath = new URL(href, window.location.href).pathname;
  refs.transitionKind.current = targetPath.startsWith("/oeuvres/")
    ? "artwork"
    : window.location.pathname.startsWith("/oeuvres/") &&
        targetPath === "/collection"
      ? "artwork-return"
      : "page";
  refs.navigationPhase.current = "leaving";
  refs.navigationTimeline.current?.kill();
  const header = refs.scope.current.querySelector(".site-header");
  if (refs.transitionKind.current === "page" && header) {
    header.inert = true;
    // The fixed header uses viewport coordinates while the document uses scrollY.
    // Both share the same visible pivot and timeline during major navigation.
    gsap.set(header, {
      autoAlpha: 1,
      y: 0,
      xPercent: 0,
      scale: 1,
      transformOrigin: `50% ${window.innerHeight / 2}px`,
      transition: "none",
    });
  }
  store.setIsTransitionActive(true);
  refs.previousOverflow.current = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  refs.contentRef.current.inert = true;
  refs.scope.current.classList.add("is-navigating");
  gsap.set(refs.cover.current, {
    autoAlpha: 1,
    yPercent: 0,
    zIndex: 0,
  });
  {
    const snapshot = createSnapshot(refs.contentRef.current);
    refs.artworkSnapshot.current.replaceChildren(snapshot);
    refs.artworkSnapshot.current.hidden = false;
    gsap.set(refs.artworkSnapshot.current, {
      clearProps: "transform,opacity,visibility,borderRadius",
      transformOrigin: "50% 50%",
      zIndex: refs.transitionKind.current === "artwork" ? 0 : 2,
    });
    if (refs.transitionKind.current !== "page")
      gsap.set(refs.cover.current, { autoAlpha: 0 });
    gsap.set(refs.contentRef.current, {
      autoAlpha: 0,
      y: refs.transitionKind.current === "artwork" ? window.innerHeight : 0,
    });
    if (refs.transitionKind.current !== "page") {
      refs.navigationPhase.current = "waiting";
      router.push(href, { scroll: false });
      return;
    }
  }
  leavePage(refs, header, href, router);
}
