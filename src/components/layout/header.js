"use client";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import FlipText from "@/components/animation/flip-text";
import { NavigationContext } from "@/components/animation/page-transition";
import TransitionLink from "@/components/animation/transition-link";
import Menu from "@/components/layout/menu";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { matchesSearch } from "@/lib/search";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function Header({ objects }) {
  const navigate = useContext(NavigationContext);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const dialog = useRef(null);
  const input = useRef(null);
  const scope = useRef(null);
  useGSAP(
    () => {
      const node = scope.current;
      let last = window.scrollY,
        travel = 0,
        direction = 0;
      const show = () => {
        node.dataset.headerHidden = "false";
      };
      const onScroll = () => {
        const current = window.scrollY;
        const delta = current - last;
        last = current;
        if (
          useMuseumStore.getState().isTransitionActive ||
          current < 80 ||
          node.contains(document.activeElement) ||
          node.querySelector("dialog[open]")
        ) {
          show();
          travel = 0;
          return;
        }
        const nextDirection = Math.sign(delta);
        if (nextDirection !== direction) travel = 0;
        direction = nextDirection;
        travel += delta;
        if (travel > 24) node.dataset.headerHidden = "true";
        else if (travel < -12) show();
      };
      const unsubscribe = useMuseumStore.subscribe((state) => {
        if (state.isTransitionActive) show();
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      node.addEventListener("focusin", show);
      return () => {
        unsubscribe();
        window.removeEventListener("scroll", onScroll);
        node.removeEventListener("focusin", show);
      };
    },
    { scope },
  );
  const { contextSafe } = useGSAP({ scope });
  const openSearch = contextSafe(() => {
    dialog.current.showModal();
    input.current.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gsap.fromTo(
        dialog.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "museum" },
      );
  });
  const results = query.trim()
    ? objects.filter((object) => matchesSearch(object, query))
    : [];
  return (
    <header className="site-header" ref={scope}>
      <TransitionLink
        href="/"
        className="brand"
        aria-label="My Creative Museum — accueil"
      >
        <MuseumLogo />
        <span className="brand-name">
          my creative
          <br />
          museum
        </span>
      </TransitionLink>
      <div className="header-actions">
        <button
          type="button"
          className="search-button"
          onClick={openSearch}
          aria-label="Rechercher une œuvre"
        >
          <Icon name="search" />
        </button>
        <Menu />
      </div>
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
        <form
          action="/collection"
          onSubmit={(event) => {
            event.preventDefault();
            dialog.current.close();
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
                  onClick={() => dialog.current.close()}
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
    </header>
  );
}
