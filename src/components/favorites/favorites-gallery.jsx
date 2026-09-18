"use client";
import { useState } from "react";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import FavoriteCard from "./favorite-card";

export default function FavoritesGallery({ objects }) {
  const [visible, setVisible] = useState(objects);
  return (
    <section className="mt-14 pb-20 lg:mt-20" aria-labelledby="favorites-title">
      <div className="mb-10 flex flex-wrap items-baseline gap-4" data-reveal>
        <h2
          id="favorites-title"
          className="text-[2.8rem] leading-none tracking-[-.055em] text-foreground lg:text-[5rem]"
        >
          Mes <em className="font-editorial font-normal">favoris.</em>
        </h2>
        <span aria-live="polite" className="text-sm text-muted">
          ({visible.length})
        </span>
      </div>
      {visible.length ? (
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3 [&_.card-image-wrap_.artwork-image]:aspect-square">
          {visible.map((object, index) => (
            <FavoriteCard
              key={object.slug}
              object={object}
              index={index}
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
