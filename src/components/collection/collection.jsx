"use client";
import FlipText from "@/components/animation/flip-text";
import ArtworkCard from "@/components/artwork/artwork-card";
import Icon from "@/components/ui/icon";
import CollectionToolbar from "./collection-toolbar";
import useCollection from "./use-collection";

export default function Collection({ objects }) {
  const {
    scope,
    query,
    movement,
    artist,
    sort,
    movements,
    artists,
    filtered,
    change,
    reset,
  } = useCollection(objects);
  return (
    <section
      className="page-gutter"
      ref={scope}
      aria-label="Œuvres de la collection"
    >
      <CollectionToolbar
        query={query}
        movement={movement}
        artist={artist}
        sort={sort}
        movements={movements}
        artists={artists}
        change={change}
      />
      <div className="collection-count flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-xs text-muted lg:pt-[1.4rem] lg:pb-[2.4rem] lg:text-[.75rem]">
        <p aria-live="polite">
          {filtered.length} œuvre{filtered.length > 1 ? "s" : ""} sur{" "}
          {objects.length}
        </p>
        {(query || movement || artist || sort !== "selection") && (
          <button
            className="min-h-11 border-b text-foreground lg:min-h-0"
            type="button"
            onClick={reset}
          >
            <FlipText>Réinitialiser les filtres</FlipText> <Icon name="close" />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="collection-grid grid grid-cols-1 gap-x-6 gap-y-8 pb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12 lg:pb-20 [&_.card-image-wrap_.artwork-image]:aspect-square">
          {filtered.map((object, index) => (
            <ArtworkCard key={object.id} object={object} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state py-12 text-center lg:pt-16 lg:pb-24">
          <h2 className="mb-4 text-[1.75rem] sm:text-[2rem]">
            Aucune rencontre, pour l’instant.
          </h2>
          <p className="mb-8 text-muted">
            Essayez un autre artiste ou retirez un filtre.
          </p>
          <button className="text-link min-h-11" type="button" onClick={reset}>
            <FlipText>Retrouver toute la collection</FlipText>{" "}
            <Icon name="arrowUpRight" />
          </button>
        </div>
      )}
    </section>
  );
}
