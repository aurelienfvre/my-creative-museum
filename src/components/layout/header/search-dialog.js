import { useRouter } from "next/navigation";
import { useContext } from "react";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import { NavigationContext } from "@/contexts/navigation-context";
import SearchForm from "./search-form";
import SearchResults from "./search-results";

export default function SearchDialog({
  dialog,
  onClose,
  input,
  query,
  setQuery,
  results,
}) {
  const navigate = useContext(NavigationContext);
  const router = useRouter();
  const onNavigate = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    onClose(() => {
      if (
        !navigate ||
        new URL(href, window.location.href).pathname ===
          window.location.pathname
      )
        router.push(href);
      else navigate(href);
    });
  };
  const canSearch = Array.from(query.trim()).length >= 3;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native dialog Escape is handled by onCancel.
    <dialog
      className="search-dialog fixed mx-auto mt-8 mb-auto max-h-[80svh] w-[calc(100%_-_2rem)] overflow-auto border-0 bg-background p-6 text-ink backdrop:bg-[rgb(20_25_30/0.48)] backdrop:backdrop-blur-[5px] backdrop:opacity-[var(--search-backdrop,1)] lg:mt-24 lg:w-[min(44rem,90vw)] lg:p-10"
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
      <div className="search-dialog-head flex items-center justify-between gap-4">
        <h2 id="search-title" className="text-[1.8rem] lg:text-[2.3rem]">
          Une œuvre en tête ?
        </h2>
        <button
          type="button"
          className="text-[2rem]"
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
      <SearchResults query={query} results={results} onNavigate={onNavigate} />
      <TransitionLink
        href={`/collection${canSearch ? `?q=${encodeURIComponent(query.trim())}` : ""}`}
        onClick={onNavigate}
        className="text-link inline-flex items-center justify-between gap-5 whitespace-nowrap pb-2 text-[0.82rem] text-foreground lg:gap-8"
      >
        <FlipText>
          {canSearch
            ? "Voir tous les résultats"
            : "Explorer toute la collection"}
        </FlipText>
      </TransitionLink>
    </dialog>
  );
}
