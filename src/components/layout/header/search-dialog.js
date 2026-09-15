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
      className="search-dialog fixed mx-auto mt-8 mb-auto max-h-[80svh] w-[calc(100%_-_2rem)] overflow-auto border-0 bg-background p-6 text-ink backdrop:bg-[rgb(20_25_30/0.48)] backdrop:backdrop-blur-[5px] lg:mt-24 lg:w-[min(44rem,90vw)] lg:p-10"
      ref={dialog}
      aria-labelledby="search-title"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") dialog.current.close();
      }}
    >
      <div className="search-dialog-head flex items-center justify-between gap-4">
        <h2 id="search-title" className="text-[1.8rem] lg:text-[2.3rem]">
          Une œuvre en tête ?
        </h2>
        <button
          type="button"
          className="text-[2rem]"
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
        className="text-link inline-flex items-center justify-between gap-5 whitespace-nowrap pb-2 text-[0.82rem] text-foreground lg:gap-8"
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
