"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function ProfileDisclosure({ title, value, children }) {
  const content = useRef(null);
  const details = useRef(null);
  const expanded = useRef(false);
  useEffect(() => {
    const element = content.current;
    return () => {
      gsap.killTweensOf(element);
    };
  }, []);
  function toggle(event) {
    event.preventDefault();
    const element = content.current;
    const disclosure = details.current;
    const open = !expanded.current;
    expanded.current = open;
    gsap.killTweensOf(element);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      disclosure.open = open;
      gsap.set(element, { clearProps: "height,opacity,overflow" });
      return;
    }
    const height = disclosure.open ? element.getBoundingClientRect().height : 0;
    const opacity = disclosure.open ? gsap.getProperty(element, "opacity") : 0;
    disclosure.open = true;
    gsap.set(element, { height: "auto", overflow: "hidden" });
    const fullHeight = element.scrollHeight;
    gsap.fromTo(
      element,
      { height, opacity },
      {
        height: open ? fullHeight : 0,
        opacity: open ? 1 : 0,
        duration: open ? 0.45 : 0.3,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          disclosure.open = open;
          gsap.set(element, { clearProps: "height,opacity,overflow" });
        },
      },
    );
  }
  return (
    <details ref={details} className="group">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Native summary provides Enter/Space activation and disclosure semantics. */}
      <summary
        onClick={toggle}
        className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 lg:min-h-20 lg:gap-5 lg:py-6 [&::-webkit-details-marker]:hidden"
      >
        <span className="min-w-0">
          <span className="block text-lg text-ink">{title}</span>
          {value && (
            <span className="mt-1 block text-sm text-muted [overflow-wrap:anywhere]">
              {value}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-2xl font-light text-foreground transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div ref={content}>{children}</div>
    </details>
  );
}
