"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useMemo, useRef } from "react";
import MuseumLogo from "@/components/ui/museum-logo";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export const NavigationContext = createContext(null);

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
  const router = useRouter();
  const committedPath = useRef(pathname);

  useGSAP(
    (_context, contextSafe) => {
      if (!useMuseumStore.getState().isFirstRender) return;
      let disposed = false;
      let exiting = false;
      let emergency;
      const content = scope.current.querySelector(".site-content");
      content.inert = true;
      const previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      const unlock = () => {
        clearTimeout(emergency);
        content.inert = false;
        document.documentElement.style.overflow = previousOverflow;
        useMuseumStore.getState().setIsFirstRender(false);
      };
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const exit = contextSafe(() => {
        if (disposed || exiting) return;
        exiting = true;
        useMuseumStore.getState().setIsFirstRender(false);
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
      });
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
            gsap.set(preloader.current, { autoAlpha: 0 });
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
    },
    { scope },
  );

  const { contextSafe } = useGSAP({ scope });
  const finishNavigation = useMemo(
    () =>
      contextSafe(() => {
        navigationPhase.current = "idle";
        artworkSnapshot.current.replaceChildren();
        artworkSnapshot.current.hidden = true;
        gsap.set(artworkSnapshot.current, { clearProps: "transform,zIndex" });
        gsap.set(contentRef.current, {
          clearProps:
            "transform,transformOrigin,borderRadius,overflow,opacity,visibility",
        });
        gsap.set(cover.current, { autoAlpha: 0 });
        ScrollTrigger.refresh();
        scope.current.classList.remove("is-navigating");
        contentRef.current.inert = false;
        const header = scope.current.querySelector(".site-header");
        if (header) {
          header.inert = false;
          gsap.set(header, {
            clearProps:
              "transform,transformOrigin,borderRadius,opacity,visibility,transition",
          });
        }
        document.documentElement.style.overflow = previousOverflow.current;
        useMuseumStore.getState().setIsTransitionActive(false);
      }),
    [contextSafe],
  );
  const navigate = contextSafe((href) => {
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
    transitionKind.current = targetPath.startsWith("/oeuvres/")
      ? "artwork"
      : window.location.pathname.startsWith("/oeuvres/") &&
          targetPath === "/collection"
        ? "artwork-return"
        : "page";
    navigationPhase.current = "leaving";
    navigationTimeline.current?.kill();
    const header = scope.current.querySelector(".site-header");
    if (transitionKind.current === "page" && header) {
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
    previousOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    contentRef.current.inert = true;
    scope.current.classList.add("is-navigating");
    gsap.set(cover.current, {
      autoAlpha: 1,
      yPercent: 0,
      zIndex: 0,
    });
    {
      // Freeze the viewport before transforming its parent: otherwise fixed
      // ScrollTrigger sections change containing block and jump offscreen.
      // Keep a non-interactive copy of the outgoing viewport while Next commits.
      // The incoming page itself then slides above it, with no colored curtain.
      const snapshot = contentRef.current.cloneNode(true);
      // cloneNode copies canvas markup, not its pixels. Capture the already-rendered
      // WebGL frame once; the rail retains its drawing buffer for this handoff.
      const sourceCanvases = contentRef.current.querySelectorAll("canvas");
      const copiedCanvases = snapshot.querySelectorAll("canvas");
      sourceCanvases.forEach((source, index) => {
        const copy = copiedCanvases[index];
        if (!copy || !source.width || !source.height) return;
        copy.width = source.width;
        copy.height = source.height;
        copy.getContext("2d")?.drawImage(source, 0, 0);
      });
      // Preserve SVG masks/gradients without introducing duplicate document IDs.
      const ids = new Map();
      snapshot.querySelectorAll("[id]").forEach((node, index) => {
        const previous = node.id;
        const next = `outgoing-${index}-${previous}`;
        ids.set(previous, next);
        node.id = next;
      });
      snapshot.querySelectorAll("*").forEach((node) => {
        for (const attribute of [...node.attributes]) {
          let value = attribute.value;
          for (const [previous, next] of ids) {
            value = value.replaceAll(`url(#${previous})`, `url(#${next})`);
            if (value === `#${previous}`) value = `#${next}`;
          }
          if (value !== attribute.value)
            node.setAttribute(attribute.name, value);
        }
      });
      snapshot
        .querySelectorAll("script,dialog,.custom-cursor")
        .forEach((node) => {
          node.remove();
        });
      const pinned = contentRef.current.querySelectorAll(
        ".pin-spacer > section",
      );
      const clonedPins = snapshot.querySelectorAll(".pin-spacer > section");
      pinned.forEach((node, index) => {
        if (getComputedStyle(node).position !== "fixed") return;
        const rect = node.getBoundingClientRect();
        const clone = clonedPins[index];
        if (!clone) return;
        // The snapshot is translated by the old scroll offset; compensate fixed pins.
        Object.assign(clone.style, {
          position: "fixed",
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          transform: "none",
          bottom: "auto",
          right: "auto",
        });
      });
      snapshot.inert = true;
      snapshot.style.transform = `translateY(${-window.scrollY}px)`;
      artworkSnapshot.current.replaceChildren(snapshot);
      artworkSnapshot.current.hidden = false;
      gsap.set(artworkSnapshot.current, {
        clearProps: "transform,opacity,visibility,borderRadius",
        transformOrigin: "50% 50%",
        zIndex: transitionKind.current === "artwork" ? 0 : 2,
      });
      if (transitionKind.current !== "page")
        gsap.set(cover.current, { autoAlpha: 0 });
      gsap.set(contentRef.current, {
        autoAlpha: 0,
        y: transitionKind.current === "artwork" ? window.innerHeight : 0,
      });
      if (transitionKind.current !== "page") {
        navigationPhase.current = "waiting";
        router.push(href, { scroll: false });
        return;
      }
    }
    gsap.set(transitionLogo.current, { autoAlpha: 0, y: 8, scale: 0.94 });
    const strokes = transitionLogo.current.querySelectorAll(".logo-stroke");
    // Longueurs SVG réelles : les valeurs normalisées à 1 sont trop petites
    // pour une interpolation CSS fiable des traits avec GSAP.
    gsap.set(strokes, {
      strokeDasharray: (_index, path) => path.getTotalLength() + 4,
      strokeDashoffset: (_index, path) => path.getTotalLength() + 4,
    });
    gsap.set(contentRef.current, {
      transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
      overflow: "hidden",
    });
    const pageLayers = [artworkSnapshot.current, header].filter(Boolean);
    navigationTimeline.current = gsap
      .timeline({
        onComplete: () => {
          navigationPhase.current = "waiting";
          gsap.set(pageLayers, { autoAlpha: 0 });
          artworkSnapshot.current.hidden = true;
          router.push(href);
        },
      })
      .to(pageLayers, {
        scale: 0.92,
        borderRadius: 12,
        duration: 0.42,
        ease: "curtain",
      })
      .to(pageLayers, {
        xPercent: -110,
        duration: 0.75,
        ease: "curtain",
      })
      .to(transitionLogo.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: "museum",
      })
      .to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: 1.15,
          stagger: 0.18,
          ease: "power2.inOut",
        },
        "-=0.15",
      );
  });
  useEffect(() => {
    if (committedPath.current === pathname) return;
    committedPath.current = pathname;
    if (navigationPhase.current !== "waiting") return;
    return contextSafe(() => {
      if (!useMuseumStore.getState().isTransitionActive) return;
      let disposed = false;
      let ready = false;
      const content = contentRef.current;
      const header = scope.current.querySelector(".site-header");
      const pageLayers =
        transitionKind.current === "page"
          ? [content, header].filter(Boolean)
          : [content];
      gsap.set(pageLayers, {
        autoAlpha: 0,
        xPercent: transitionKind.current !== "page" ? 0 : 110,
        scale: transitionKind.current !== "page" ? 1 : 0.92,
        borderRadius: transitionKind.current !== "page" ? 0 : 12,
      });
      const enter = contextSafe(() => {
        if (disposed || ready) return;
        ready = true;
        observer.disconnect();
        clearTimeout(fallback);
        navigationPhase.current = "entering";
        window.scrollTo({ top: 0, behavior: "instant" });
        gsap.set(content, {
          autoAlpha: 1,
          transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
        });
        if (transitionKind.current === "page" && header) {
          gsap.set(header, {
            autoAlpha: 1,
            transformOrigin: `50% ${window.innerHeight / 2}px`,
          });
        }
        if (transitionKind.current === "artwork-return") {
          navigationTimeline.current = gsap
            .timeline({ onComplete: finishNavigation })
            .to(artworkSnapshot.current, {
              y: window.innerHeight,
              duration: 0.8,
              ease: "museum",
            });
          return;
        }
        if (transitionKind.current === "artwork") {
          navigationTimeline.current = gsap
            .timeline({ onComplete: finishNavigation })
            .fromTo(
              content,
              { y: window.innerHeight },
              { y: 0, duration: 0.85, ease: "museum" },
            );
          return;
        }
        navigationTimeline.current = gsap
          .timeline({ onComplete: finishNavigation })
          .to(transitionLogo.current.querySelectorAll(".logo-stroke"), {
            strokeDashoffset: (_index, path) => -(path.getTotalLength() + 4),
            delay: 0.25,
            duration: 0.55,
            stagger: { each: 0.08, from: "end" },
            ease: "power2.inOut",
          })
          .set(transitionLogo.current, { autoAlpha: 0 })
          .to(pageLayers, { xPercent: 0, duration: 0.85, ease: "curtain" })
          .to(pageLayers, {
            scale: 1,
            borderRadius: 0,
            duration: 0.45,
            ease: "curtain",
          });
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
    })();
  }, [pathname, contextSafe, finishNavigation]);
  useGSAP(
    () => () => {
      navigationTimeline.current?.kill();
      if (navigationPhase.current !== "idle") {
        document.documentElement.style.overflow = previousOverflow.current;
        useMuseumStore.getState().setIsTransitionActive(false);
      }
    },
    { scope },
  );

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
