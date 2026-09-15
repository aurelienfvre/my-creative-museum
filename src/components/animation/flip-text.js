"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FlipText({ children, className = "" }) {
  const scope = useRef(null);
  const text = String(children);
  useGSAP(
    () => {
      const interactive = scope.current.closest("a,button,summary");
      if (!interactive) return;
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        (_mediaContext, contextSafe) => {
          const glyphs = scope.current.querySelectorAll(".flip-glyph");
          // Un seul progrès pilote les deux faces : aucune conversion %/px
          // et aucun décalage résiduel entre l’entrée et la sortie.
          gsap.set(glyphs, { "--flip-progress": 0 });
          let hovered = interactive.matches(":hover"),
            focused = interactive === document.activeElement;
          const animate = contextSafe(() => {
            gsap.to(glyphs, {
              "--flip-progress": hovered || focused ? 1 : 0,
              duration: 0.48,
              stagger: 0.014,
              ease: "museum",
              overwrite: true,
            });
          });
          if (hovered || focused) animate();
          const enter = () => {
            hovered = true;
            animate();
          };
          const leave = () => {
            hovered = false;
            animate();
          };
          const focus = () => {
            focused = true;
            animate();
          };
          const blur = () => {
            focused = false;
            animate();
          };
          interactive.addEventListener("pointerenter", enter);
          interactive.addEventListener("pointerleave", leave);
          interactive.addEventListener("focus", focus);
          interactive.addEventListener("blur", blur);
          return () => {
            interactive.removeEventListener("pointerenter", enter);
            interactive.removeEventListener("pointerleave", leave);
            interactive.removeEventListener("focus", focus);
            interactive.removeEventListener("blur", blur);
          };
        },
      );
      return () => media.revert();
    },
    { scope, dependencies: [text], revertOnUpdate: true },
  );
  return (
    <span ref={scope} className={`flip-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="flip-visual" aria-hidden="true">
        {[...text].map((letter, index) => (
          <span className="flip-glyph" key={`${index}-${letter}`}>
            <span className="flip-front">
              {letter === " " ? "\u00a0" : letter}
            </span>
            <span className="flip-back">
              {letter === " " ? "\u00a0" : letter}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
