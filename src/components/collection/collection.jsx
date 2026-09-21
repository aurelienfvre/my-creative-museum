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
      <div className="collection-count flex items-center justify-between pt-[1.4rem] pb-[2.4rem] text-[.7rem] text-muted lg:text-[.75rem]">
        <p aria-live="polite">
          {filtered.length} œuvre{filtered.length > 1 ? "s" : ""} sur{" "}
          {objects.length}
        </p>
        {(query || movement || artist || sort !== "selection") && (
          <button
            className="border-b text-foreground"
            type="button"
            onClick={reset}
          >
            <FlipText>Réinitialiser les filtres</FlipText> <Icon name="close" />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="collection-grid grid grid-cols-1 gap-10 pb-20 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12 [&_.card-image-wrap_.artwork-image]:aspect-square">
          {filtered.map((object, index) => (
            <ArtworkCard key={object.id} object={object} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state pt-16 pb-24 text-center">
          <h2 className="mb-4 text-[2rem]">
            Aucune rencontre, pour l’instant.
          </h2>
          <p className="mb-8 text-muted">
            Essayez un autre artiste ou retirez un filtre.
          </p>
          <button className="text-link" type="button" onClick={reset}>
            <FlipText>Retrouver toute la collection</FlipText>{" "}
            <Icon name="arrowUpRight" />
          </button>
        </div>
      )}
    </section>
  );
}
