"use client";
import { useRef, useState } from "react";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkCard from "@/components/artwork/artwork-card";
import { gsap } from "@/lib/gsap";
import FavoriteButton from "./favorite-button";

export default function FavoritesGallery({ objects }) {
  const [visible, setVisible] = useState(objects);
  const [error, setError] = useState("");
  function restore(object, message) {
    setError(message || "");
    setVisible((previous) =>
      previous.some((item) => item.slug === object.slug)
        ? previous
        : [...previous, object].sort(
            (a, b) => objects.indexOf(a) - objects.indexOf(b),
          ),
    );
  }
  return (
    <section className="mt-14 pb-20 lg:mt-20" aria-labelledby="favorites-title">
      <div className="mb-10 flex flex-wrap items-baseline gap-4" data-reveal>
        <h2
          id="favorites-title"
          tabIndex={-1}
          className="text-[2.8rem] leading-none tracking-[-.055em] text-foreground lg:text-[5rem]"
        >
          Mes <em className="font-editorial font-normal">favoris.</em>
        </h2>
        <span aria-live="polite" className="text-sm text-muted">
          ({visible.length} favori{visible.length > 1 ? "s" : ""})
        </span>
      </div>
      {error && (
        <p role="alert" className="mb-6 text-sm text-red-800">
          {error}
        </p>
      )}
      {visible.length ? (
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3 [&_.card-image-wrap_.artwork-image]:aspect-square">
          {visible.map((object, index) => (
            <FavoriteCard
              key={object.slug}
              object={object}
              index={index}
              onRestore={restore}
              onRemove={(slug) =>
                setVisible((previous) =>
                  previous.filter((item) => item.slug !== slug),
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="py-10 lg:py-16" data-reveal>
          <p className="mb-6 max-w-xl text-xl text-muted">
            Les œuvres que vous gardez se retrouvent ici.
          </p>
          <TransitionLink
            href="/collection"
            className="text-link text-foreground"
          >
            <FlipText>Explorer la collection</FlipText>
          </TransitionLink>
        </div>
      )}
    </section>
  );
}

function FavoriteCard({ object, index, onRemove, onRestore }) {
  const ref = useRef(null);
  function changed(saved, feedback) {
    if (saved) {
      if (ref.current) {
        gsap.killTweensOf(ref.current);
        gsap.set(ref.current, { autoAlpha: 1, y: 0 });
      }
      onRestore(object, feedback.error);
      return;
    }
    if (!feedback.pending) return;
    if (ref.current?.contains(document.activeElement)) {
      const sibling =
        ref.current.nextElementSibling || ref.current.previousElementSibling;
      const target =
        sibling?.querySelector("button, a") ||
        document.getElementById("favorites-title");
      target?.focus({ preventScroll: true });
    }
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
          title={object.title}
          initialSaved
          onChange={changed}
          compact
        />
      </div>
    </article>
  );
}
