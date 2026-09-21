"use client";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import MuseumLogo from "@/components/ui/museum-logo";
import { NavigationContext } from "@/contexts/navigation-context";
import { usePageNavigation } from "./page-transition/use-page-navigation";
export default function PageTransition({ children, navigation }) {
  const scope = useRef(null);
  const cover = useRef(null);
  const artworkSnapshot = useRef(null);
  const transitionKind = useRef("page");
  const nativeTransition = useRef(null);
  const artworkVisits = useRef([]);
  const returnScroll = useRef(0);
  const transitionLogo = useRef(null);
  const preloader = useRef(null);
  const navigationTimeline = useRef(null);
  const navigationPhase = useRef("idle");
  const contentRef = useRef(null);
  const previousOverflow = useRef("");
  const pathname = usePathname();
  const committedPath = useRef(pathname);
  const refs = useRef({
    scope,
    cover,
    artworkSnapshot,
    transitionKind,
    nativeTransition,
    artworkVisits,
    returnScroll,
    transitionLogo,
    preloader,
    navigationTimeline,
    navigationPhase,
    contentRef,
    previousOverflow,
    committedPath,
  }).current;
  const navigate = usePageNavigation(refs);
  return (
    <NavigationContext.Provider value={navigate}>
      <div
        ref={scope}
        className="page-transition-host [&.is-navigating]:overflow-clip"
      >
        <div
          ref={preloader}
          className="preloader fixed inset-0 z-100 grid place-items-center bg-foreground text-background animate-[preloader-failsafe_0s_7s_forwards] [&_.logo-stroke]:[stroke-dasharray:1] [&_.logo-stroke]:[stroke-dashoffset:1] motion-reduce:[&_.logo-stroke]:[stroke-dashoffset:0]"
          aria-hidden="true"
        >
          <div className="preloader-signature flex flex-col items-center gap-[1.1rem] [&_svg]:size-[5.5rem]">
            <MuseumLogo size={88} />
            <span className="preloader-name text-[.7rem] tracking-[.04em] opacity-0 motion-reduce:opacity-100">
              my creative museum
            </span>
          </div>
          <span className="preloader-note absolute bottom-8 font-editorial text-[1.1rem]">
            Le regard s’éveille.
          </span>
        </div>
        <div
          ref={cover}
          className="page-transition fixed inset-0 z-0 invisible grid place-items-center bg-foreground text-background"
          aria-hidden="true"
        >
          <div
            ref={transitionLogo}
            className="transition-logo invisible opacity-0 [&_svg]:block [&_svg]:w-[clamp(60px,4.75rem,100px)] [&_svg]:h-auto [&_.logo-stroke]:[stroke-dasharray:400] [&_.logo-stroke]:[stroke-dashoffset:400]"
          >
            <MuseumLogo size={76} normalizeStrokes={false} />
          </div>
        </div>
        <div
          ref={artworkSnapshot}
          className="artwork-snapshot fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background [&[hidden]]:hidden [&>.site-content]:origin-top-left"
          aria-hidden="true"
          hidden
        />
        {navigation}
        <div ref={contentRef} className="site-content relative z-1 isolate">
          {children}
        </div>
        <noscript>
          <style>{`.preloader,.page-transition{display:none!important}.site-content,.motion-scope [data-arrive],.motion-scope [data-reveal],.media-content{opacity:1!important;visibility:visible!important}.menu-toggle{display:none!important}`}</style>
        </noscript>
      </div>
    </NavigationContext.Provider>
  );
}
