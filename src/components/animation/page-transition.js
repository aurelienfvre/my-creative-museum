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
      <div ref={scope} className="page-transition-host">
        <div ref={preloader} className="preloader" aria-hidden="true">
          <div className="preloader-signature">
            <MuseumLogo size={88} />
            <span className="preloader-name">my creative museum</span>
          </div>
          <span className="preloader-note">Le regard s’éveille.</span>
        </div>
        <div ref={cover} className="page-transition" aria-hidden="true">
          <div ref={transitionLogo} className="transition-logo">
            <MuseumLogo size={76} normalizeStrokes={false} />
          </div>
        </div>
        <div
          ref={artworkSnapshot}
          className="artwork-snapshot"
          aria-hidden="true"
          hidden
        />
        {navigation}
        <div ref={contentRef} className="site-content">
          {children}
        </div>
        <noscript>
          <style>{`.preloader,.page-transition{display:none!important}.site-content,.motion-scope [data-arrive],.motion-scope [data-reveal],.media-content{opacity:1!important;visibility:visible!important}.menu-toggle{display:none!important}`}</style>
        </noscript>
      </div>
    </NavigationContext.Provider>
  );
}
