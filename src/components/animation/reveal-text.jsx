"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function RevealText({
  text,
  className = "",
  as: Tag = "h2",
  followSelector,
}) {
  const scope = useRef(null);
  const first = useMuseumStore((state) => state.isFirstRender);
  const transition = useMuseumStore((state) => state.isTransitionActive);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!first && !transition) setReady(true);
  }, [first, transition]);
  useGSAP(
    () => {
      if (!ready) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const follow = followSelector
          ? scope.current.parentElement.querySelector(followSelector)
          : null;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 90%",
            end: "top 35%",
            scrub: 0.3,
          },
        });
        if (follow) gsap.set(follow, { autoAlpha: 0, y: 14 });
        timeline.fromTo(
          ".reveal-word > span",
          { yPercent: 65, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.025,
            ease: "none",
          },
        );
        if (follow)
          timeline.to(
            follow,
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "museum" },
            "-=.15",
          );
      });
      return () => media.revert();
    },
    { scope, dependencies: [ready], revertOnUpdate: true },
  );
  return (
    <Tag ref={scope} className={`reveal-text ${className}`}>
      <span>
        {text.split(" ").map((word, index, words) => (
          <span
            className="reveal-word inline-block overflow-hidden pt-[.1em] pb-[.22em] pl-0 pr-0 -mb-[.22em] [perspective:600px] align-top [&>span]:inline-block"
            key={`${index}-${word}`}
          >
            <span className="whitespace-pre">
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
