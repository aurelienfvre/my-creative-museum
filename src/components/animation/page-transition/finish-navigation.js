import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
export function finishNavigation(refs) {
  refs.navigationPhase.current = "idle";
  delete document.documentElement.dataset.artworkReturn;
  refs.artworkSnapshot.current.replaceChildren();
  refs.artworkSnapshot.current.hidden = true;
  gsap.set(refs.artworkSnapshot.current, { clearProps: "transform,zIndex" });
  gsap.set(refs.contentRef.current, {
    clearProps:
      "transform,transformOrigin,borderRadius,overflow,opacity,visibility",
  });
  gsap.set(refs.cover.current, { autoAlpha: 0 });
  ScrollTrigger.refresh();
  refs.scope.current.classList.remove("is-navigating");
  refs.contentRef.current.inert = false;
  const header = refs.scope.current.querySelector(".site-header");
  if (header) {
    header.inert = false;
    gsap.set(header, {
      clearProps:
        "transform,transformOrigin,borderRadius,opacity,visibility,transition",
    });
  }
  document.documentElement.style.overflow = refs.previousOverflow.current;
  useMuseumStore.getState().setIsTransitionActive(false);
}
