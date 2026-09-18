"use client";
import { useRef } from "react";
import ArtworkCard from "@/components/artwork/artwork-card";
import { gsap } from "@/lib/gsap";
import FavoriteButton from "./favorite-button";

export default function FavoriteCard({ object, index, onRemove }) {
  const ref = useRef(null);
  function changed(saved) {
    if (saved) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onRemove(object.slug);
      return;
    }
    gsap.to(ref.current, {
      autoAlpha: 0,
      y: -16,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onRemove(object.slug),
    });
  }
  return (
    <article ref={ref} className="min-w-0" data-reveal>
      <ArtworkCard object={object} index={index} />
      <div className="mt-5">
        <FavoriteButton
          slug={object.slug}
          initialSaved
          onChange={changed}
          compact
        />
      </div>
    </article>
  );
}
