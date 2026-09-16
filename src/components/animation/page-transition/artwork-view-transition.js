import { finishNavigation } from "./finish-navigation";

// Resolve the browser's update callback only after Next has committed the route
// and waitForPage has prepared its primary image (router.push returns no promise).
export function startArtworkViewTransition(refs, href, router) {
  const root = document.documentElement;
  root.dataset.artworkTransition =
    refs.transitionKind.current === "artwork-return" ? "return" : "enter";
  let resolvePage;
  const pageReady = new Promise((resolve) => {
    resolvePage = resolve;
  });
  const pending = {
    transition: null,
    complete: () => resolvePage(),
    cancel: () => {
      pending.transition?.skipTransition();
      resolvePage();
    },
  };
  refs.nativeTransition.current = pending;
  // A stalled navigation must never leave the UI locked indefinitely.
  const timeout = setTimeout(pending.cancel, 4500);
  const cleanup = () => {
    clearTimeout(timeout);
    if (refs.nativeTransition.current !== pending) return;
    refs.nativeTransition.current = null;
    delete root.dataset.artworkTransition;
    finishNavigation(refs);
  };
  try {
    pending.transition = document.startViewTransition(async () => {
      refs.navigationPhase.current = "waiting";
      router.push(href, { scroll: false });
      await pageReady;
    });
    // ready rejects when a transition is skipped; navigation still completes.
    pending.transition.ready.catch(() => {});
    pending.transition.finished.then(cleanup, cleanup);
  } catch {
    cleanup();
    router.push(href);
  }
}
