import { gsap } from "@/lib/gsap";
import { enterPage } from "./enter-page";
export function waitForPage(refs, contextSafe, finishNavigation) {
  let disposed = false;
  let ready = false;
  const content = refs.contentRef.current;
  const header = refs.scope.current.querySelector(".site-header");
  const pageLayers =
    refs.transitionKind.current === "page"
      ? [content, header].filter(Boolean)
      : [content];
  const native = refs.nativeTransition.current;
  if (!native)
    gsap.set(pageLayers, {
      autoAlpha: 0,
      xPercent: refs.transitionKind.current !== "page" ? 0 : 110,
      scale: refs.transitionKind.current !== "page" ? 1 : 0.92,
      borderRadius: refs.transitionKind.current !== "page" ? 0 : 12,
    });
  const enter = contextSafe(() => {
    if (disposed || ready) return;
    ready = true;
    observer.disconnect();
    clearTimeout(fallback);
    if (native) {
      if (refs.nativeTransition.current !== native) return;
      window.scrollTo({ top: refs.returnScroll.current, behavior: "instant" });
      refs.navigationPhase.current = "entering";
      native.complete();
    } else {
      enterPage(refs, content, header, pageLayers, finishNavigation);
    }
  });
  let checking = false;
  const check = () => {
    if (
      checking ||
      content.querySelector(".route-loading") ||
      !content.querySelector("main")
    )
      return;
    checking = true;
    const primary = content.querySelector('[data-primary-media="true"]');
    Promise.allSettled([
      document.fonts.ready,
      primary?.decode?.() || Promise.resolve(),
    ]).then(() => {
      if (!disposed) enter();
    });
  };
  const observer = new MutationObserver(check);
  observer.observe(content, { childList: true, subtree: true });
  const fallback = setTimeout(enter, 4500);
  check();
  return () => {
    disposed = true;
    observer.disconnect();
    clearTimeout(fallback);
  };
}
