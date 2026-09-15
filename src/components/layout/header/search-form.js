"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Icon from "@/components/ui/icon";
import { NavigationContext } from "@/contexts/navigation-context";

export default function SearchForm({ query, setQuery, input, onClose }) {
  const navigate = useContext(NavigationContext);
  const router = useRouter();
  return (
    <form
      action="/collection"
      onSubmit={(event) => {
        event.preventDefault();
        onClose();
        const href = `/collection?q=${encodeURIComponent(query)}`;
        if (window.location.pathname === "/collection" || !navigate)
          router.push(href);
        else navigate(href);
      }}
    >
      <label className="sr-only" htmlFor="global-search">
        Titre, artiste ou mouvement
      </label>
      <input
        ref={input}
        id="global-search"
        name="q"
        placeholder="Un titre, un artiste, une émotion…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      <button type="submit" aria-label="Afficher tous les résultats">
        <Icon name="arrowUpRight" />
      </button>
    </form>
  );
}
