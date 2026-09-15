"use client";
import { useRef, useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import Menu from "@/components/layout/menu";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { matchesSearch } from "@/lib/search";

import SearchDialog from "./header/search-dialog";
import useHeaderScroll from "./header/use-header-scroll";

export default function Header({ objects }) {
  const [query, setQuery] = useState("");
  const dialog = useRef(null);
  const input = useRef(null);
  const scope = useRef(null);
  useHeaderScroll(scope);
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
      <SearchDialog
        dialog={dialog}
        input={input}
        query={query}
        setQuery={setQuery}
        results={results}
      />
    </header>
  );
}
