import TransitionLink from "@/components/animation/transition-link";
import SearchHighlight from "./search-highlight";
import SearchThumbnail from "./search-thumbnail";

export default function SearchResults({ query, results, onNavigate }) {
  return (
    <div
      className="search-results my-[1.8rem] text-[0.85rem]"
      aria-live="polite"
    >
      {Array.from(query.trim()).length >= 3 && (
        <>
          <p className="eyebrow font-mono text-[0.65rem] uppercase tracking-[0.08em] lg:text-[0.7rem]">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          {results.slice(0, 6).map((object) => (
            <TransitionLink
              className="flex items-center gap-4 border-b border-line py-3 transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5"
              href={`/oeuvres/${object.slug}`}
              key={object.id}
              onClick={onNavigate}
            >
              <SearchThumbnail src={object.image} />
              <span className="min-w-0 break-words">
                <SearchHighlight text={object.title} query={query} />
                <small className="mt-[0.2rem] block text-[0.7rem] text-muted">
                  <SearchHighlight text={object.artist} query={query} />
                </small>
              </span>
            </TransitionLink>
          ))}
          {!results.length && (
            <p>
              Aucune œuvre ne correspond à cette recherche. Essayez un autre
              titre ou artiste.
            </p>
          )}
        </>
      )}
    </div>
  );
}
