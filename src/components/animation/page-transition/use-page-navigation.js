import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
import { finishNavigation } from "./finish-navigation";
import { navigateTo } from "./navigate";
import { setupPreloader } from "./setup-preloader";
import { waitForPage } from "./wait-for-page";
export function usePageNavigation(refs) {
  const pathname = usePathname();
  const router = useRouter();
  useGSAP((_context, contextSafe) => setupPreloader(refs, contextSafe), {
    scope: refs.scope,
  });
  const { contextSafe } = useGSAP({ scope: refs.scope });
  const finish = useMemo(
    () => contextSafe(() => finishNavigation(refs)),
    [contextSafe, refs],
  );
  const navigate = contextSafe((href) => navigateTo(refs, href, router));
  useEffect(() => {
    if (!shouldEnter(refs, pathname)) return;
    return contextSafe(() => {
      if (!useMuseumStore.getState().isTransitionActive) return;
      return waitForPage(refs, contextSafe, finish);
    })();
  }, [pathname, contextSafe, finish, refs]);
  useGSAP(
    () => () => {
      refs.navigationTimeline.current?.kill();
      if (refs.navigationPhase.current !== "idle") {
        document.documentElement.style.overflow = refs.previousOverflow.current;
        useMuseumStore.getState().setIsTransitionActive(false);
      }
    },
    { scope: refs.scope },
  );
  return navigate;
}

function shouldEnter(refs, pathname) {
  if (refs.committedPath.current === pathname) return false;
  refs.committedPath.current = pathname;
  return refs.navigationPhase.current === "waiting";
}
