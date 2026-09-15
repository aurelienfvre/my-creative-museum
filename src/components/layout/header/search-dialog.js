import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import SearchForm from "./search-form";
import SearchResults from "./search-results";

export default function SearchDialog({
  dialog,
  input,
  query,
  setQuery,
  results,
}) {
  return (
    <dialog
      className="search-dialog"
      ref={dialog}
      aria-labelledby="search-title"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") dialog.current.close();
      }}
    >
      <div className="search-dialog-head">
        <h2 id="search-title">Une œuvre en tête ?</h2>
        <button
          type="button"
          onClick={() => dialog.current.close()}
          aria-label="Fermer la recherche"
        >
          <Icon name="close" />
        </button>
      </div>
      <SearchForm
        query={query}
        setQuery={setQuery}
        input={input}
        onClose={() => dialog.current.close()}
      />
      <SearchResults
        query={query}
        results={results}
        onClose={() => dialog.current.close()}
      />
      <TransitionLink
        href={`/collection${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        onClick={() => dialog.current.close()}
        className="text-link"
      >
        <FlipText>
          {query ? "Voir tous les résultats" : "Explorer toute la collection"}
        </FlipText>{" "}
        <span>
          <Icon name="arrowUpRight" />
        </span>
      </TransitionLink>
    </dialog>
  );
}
