"use client";
import { useRef } from "react";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import { useGSAP } from "@/lib/gsap";
export default function Footer() {
  const footer = useRef(null);
  useGSAP(
    () => {
      const node = footer.current;
      const update = () =>
        node.classList.toggle(
          "footer-reveal",
          node.offsetHeight < window.innerHeight * 0.9,
        );
      const observer = new ResizeObserver(update);
      observer.observe(node);
      window.addEventListener("resize", update);
      update();
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
      };
    },
    { scope: footer },
  );
  return (
    <footer ref={footer} className="site-footer">
      <div className="footer-top">
        <p>Gardez l’œil ouvert.</p>
        <nav className="footer-links" aria-label="Pied de page">
          <TransitionLink href="/collection">
            <FlipText>La collection</FlipText>
          </TransitionLink>
          <TransitionLink href="/musee">
            <FlipText>Le musée</FlipText>
          </TransitionLink>
          <TransitionLink href="/billetterie">
            <FlipText>Billetterie</FlipText> <Icon name="arrowUpRight" />
          </TransitionLink>
        </nav>
      </div>
      <div className="footer-print">
        <svg
          viewBox="0 0 1200 232"
          aria-hidden="true"
          className="footer-print-type"
        >
          <defs>
            <pattern
              id="museum-halftone"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(15)"
            >
              <circle cx="2" cy="2" r="1.65" fill="white" />
            </pattern>
            <mask
              id="museum-halftone-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="270"
            >
              <rect width="1200" height="270" fill="url(#museum-halftone)" />
            </mask>
            <linearGradient id="museum-ink-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".34" />
              <stop offset=".5" stopColor="currentColor" stopOpacity=".17" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".015" />
            </linearGradient>
          </defs>
          <text
            x="-9"
            y="256"
            textLength="1218"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#museum-ink-fade)"
            mask="url(#museum-halftone-mask)"
          >
            MUSEUM
          </text>
        </svg>
      </div>
    </footer>
  );
}
