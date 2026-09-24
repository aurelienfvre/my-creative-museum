import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import SearchForm from "./search-form";
import SearchResults from "./search-results";
import useSearchNavigation from "./use-search-navigation";

export default function SearchDialog({
  dialog,
  onClose,
  input,
  query,
  setQuery,
  results,
  status,
  onRetry,
}) {
  const onNavigate = useSearchNavigation(onClose);
  const canSearch = Array.from(query.trim()).length >= 3;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native dialog Escape is handled by onCancel.
    <dialog
      className="search-dialog max-lg:[&_input]:text-[max(16px,.8rem)] max-lg:[&_select]:text-[max(16px,.8rem)] fixed inset-x-0 mx-auto mt-4 mb-auto max-h-none w-[calc(100vw_-_2rem)] max-w-none overflow-hidden border-0 bg-background p-0 text-ink backdrop:bg-[rgb(20_25_30/0.48)] backdrop:backdrop-blur-[5px] backdrop:opacity-[var(--search-backdrop,1)] lg:mt-24 lg:w-[min(44rem,90vw)]"
      ref={dialog}
      aria-labelledby="search-title"
      onClick={(event) => {
        if (event.target !== dialog.current) return;
        const rect = dialog.current.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div
        className="search-dialog-scroll box-border max-h-[calc(100dvh_-_2rem)] w-full min-w-0 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable] overscroll-contain p-5 sm:p-6 lg:max-h-[80svh] lg:p-10"
        data-lenis-prevent
      >
        <div className="search-dialog-head flex items-center justify-between gap-4">
          <h2
            id="search-title"
            className="min-w-0 text-balance text-[clamp(1.5rem,5vw,1.8rem)] leading-[1.15] lg:text-[2.3rem]"
          >
            Une œuvre en tête ?
          </h2>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center lg:size-8 [&>svg]:size-6"
            onClick={() => onClose()}
            aria-label="Fermer la recherche"
          >
            <Icon name="close" />
          </button>
        </div>
        <SearchForm
          query={query}
          setQuery={setQuery}
          input={input}
          onClose={onClose}
        />
        {Array.from(query.trim()).length < 3 && (
          <p id="search-help" className="mt-3 text-sm text-muted">
            Saisissez au moins 3 caractères.
          </p>
        )}
        {status === "loading" && (
          <output className="my-6 block text-sm text-muted">
            Chargement de la collection…
          </output>
        )}
        {status === "error" && (
          <div className="my-6 text-sm">
            <p role="alert">La recherche est momentanément indisponible.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 min-h-11 text-foreground underline underline-offset-4"
            >
              Réessayer
            </button>
          </div>
        )}
        {status === "ready" && (
          <SearchResults
            query={query}
            results={results}
            onNavigate={onNavigate}
          />
        )}
        <TransitionLink
          href={`/collection${canSearch ? `?q=${encodeURIComponent(query.trim())}` : ""}`}
          onClick={onNavigate}
          className="text-link inline-flex min-h-11 items-center justify-between gap-5 whitespace-nowrap pb-2 text-[14px] text-foreground lg:min-h-0 lg:gap-8 lg:text-[0.82rem]"
        >
          <FlipText>
            {canSearch
              ? "Voir tous les résultats"
              : "Explorer toute la collection"}
          </FlipText>
        </TransitionLink>
      </div>
    </dialog>
  );
}
