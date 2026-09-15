import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";

export default function SearchResults({ query, results, onClose }) {
  return (
    <div
      className="search-results my-[1.8rem] text-[0.85rem]"
      aria-live="polite"
    >
      {query.trim() ? (
        <>
          <p className="eyebrow font-mono text-[0.65rem] uppercase tracking-[0.08em] lg:text-[0.7rem]">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          {results.slice(0, 6).map((object) => (
            <TransitionLink
              className="flex justify-between border-b border-line py-[0.9rem]"
              href={`/oeuvres/${object.slug}`}
              key={object.id}
              onClick={() => onClose()}
            >
              <span>
                {object.title}
                <small className="mt-[0.2rem] block text-[0.7rem] text-muted">
                  {object.artist}
                </small>
              </span>
              <span>
                <Icon name="arrowUpRight" />
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
      ) : (
        <p>Essayez « Monet », « bleu » ou « Renaissance ».</p>
      )}
    </div>
  );
}
