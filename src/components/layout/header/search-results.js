import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";

export default function SearchResults({ query, results, onClose }) {
  return (
    <div className="search-results" aria-live="polite">
      {query.trim() ? (
        <>
          <p className="eyebrow">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          {results.slice(0, 6).map((object) => (
            <TransitionLink
              href={`/oeuvres/${object.slug}`}
              key={object.id}
              onClick={() => onClose()}
            >
              <span>
                {object.title}
                <small>{object.artist}</small>
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
