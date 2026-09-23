"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { NavigationContext } from "@/contexts/navigation-context";

export default function SearchForm({ query, setQuery, input, onClose }) {
  const navigate = useContext(NavigationContext);
  const router = useRouter();
  return (
    <search>
      <form
        aria-label="Rechercher dans la collection"
        className="mt-8 flex border-b border-foreground pb-2 focus-within:outline-2 focus-within:outline-foreground focus-within:outline-offset-4"
        action="/collection"
        onSubmit={(event) => {
          event.preventDefault();
          if (Array.from(query.trim()).length < 3) return;
          const href = `/collection?q=${encodeURIComponent(query)}`;
          onClose(() => {
            if (window.location.pathname === "/collection" || !navigate)
              router.push(href);
            else navigate(href);
          });
        }}
      >
        <label className="sr-only" htmlFor="global-search">
          Titre, artiste ou mouvement
        </label>
        <input
          className="min-h-11 w-full min-w-0 border-0 bg-transparent text-[max(16px,0.8rem)] outline-0 lg:min-h-0 lg:text-[1rem]"
          ref={input}
          id="global-search"
          name="q"
          type="search"
          placeholder="Un titre, un artiste…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          aria-describedby={
            Array.from(query.trim()).length < 3 ? "search-help" : undefined
          }
        />
      </form>
    </search>
  );
}
