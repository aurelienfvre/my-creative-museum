// An artwork journey has one non-artwork origin. Related works replace the
// current history entry, so returning restores the original cached page.
export function prepareNavigation(refs, href, router, options) {
  const visits = refs.artworkVisits.current;
  const current = window.location.pathname + window.location.search;
  const root = document.documentElement;
  if (options.back) {
    const visit = visits.pop();
    const source = visit?.source || href;
    refs.returnScroll.current = visit?.scroll || 0;
    root.dataset.artworkReturn = "true";
    // Keep this intent after the transition: cached/streamed effects may resume later.
    root.dataset.restoredPage = new URL(source, window.location.href).pathname;
    return {
      href: source,
      router: { push: () => (visit ? router.back() : router.replace(source)) },
    };
  }
  delete root.dataset.restoredPage;
  refs.returnScroll.current = 0;
  const target = new URL(href, window.location.href);
  const detailPaths = ["/compte", "/connexion", "/inscription"];
  if (
    !target.pathname.startsWith("/oeuvres/") &&
    !detailPaths.includes(target.pathname)
  ) {
    visits.length = 0;
    return { href, router };
  }
  if (
    (window.location.pathname.startsWith("/oeuvres/") &&
      target.pathname.startsWith("/oeuvres/")) ||
    (detailPaths.includes(window.location.pathname) &&
      detailPaths.includes(target.pathname))
  ) {
    // Do not turn a suggested artwork into the origin of the Return button.
    return {
      href,
      router: { push: (url, settings) => router.replace(url, settings) },
    };
  }
  if (
    !window.location.pathname.startsWith("/oeuvres/") &&
    !detailPaths.includes(window.location.pathname)
  )
    visits.length = 0;
  visits.push({ source: current, scroll: window.scrollY });
  return { href, router };
}
