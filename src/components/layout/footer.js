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
    <footer
      ref={footer}
      className="site-footer relative z-0 overflow-clip bg-foreground px-5 pt-8 pb-0 text-background [&.footer-reveal]:sticky [&.footer-reveal]:bottom-0 motion-reduce:[&.footer-reveal]:relative lg:px-14 lg:pt-12"
    >
      <div className="footer-top flex flex-col items-start justify-between gap-8 lg:flex-row">
        <p className="font-editorial text-[2rem]">Gardez l’œil ouvert.</p>
        <nav
          className="footer-links flex gap-[1.3rem] text-[0.75rem] lg:gap-8 lg:text-[0.8rem] [&>a]:inline-flex [&>a]:items-center [&>a]:gap-[0.65rem] [&>a]:whitespace-nowrap"
          aria-label="Pied de page"
        >
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
      <div className="footer-print relative -mx-5 mt-10 pt-[1.2rem] lg:-mx-14">
        <svg
          viewBox="0 0 1200 232"
          aria-hidden="true"
          className="footer-print-type mt-[0.8rem] mb-0 block h-auto w-full font-sans text-[290px] font-black tracking-[-0.075em] text-background"
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
