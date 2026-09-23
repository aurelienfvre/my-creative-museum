"use client";
import { useRef, useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import AccountLink from "@/components/auth/account-link";
import Menu from "@/components/layout/menu";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { matchesSearch } from "@/lib/search";
import SearchDialog from "./header/search-dialog";
import useHeaderScroll from "./header/use-header-scroll";
import useSearchDialog from "./header/use-search-dialog";

export default function Header({ objects }) {
  const [query, setQuery] = useState("");
  const dialog = useRef(null);
  const input = useRef(null);
  const scope = useRef(null);
  useHeaderScroll(scope);
  const { openSearch, closeSearch } = useSearchDialog(dialog, input, scope);
  const results =
    Array.from(query.trim()).length >= 3
      ? objects.filter((object) => matchesSearch(object, query))
      : [];
  return (
    <header
      className="site-header fixed inset-x-0 top-0 z-50 mx-0 flex h-20 items-center justify-between border-b border-line bg-background px-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] data-[header-hidden=true]:-translate-y-[110%] motion-reduce:transition-none sm:px-5 lg:h-25 lg:px-14"
      ref={scope}
    >
      <TransitionLink
        href="/"
        className="brand flex min-h-11 shrink-0 items-center gap-[0.7rem] [&>svg]:size-[2.7rem] lg:[&>svg]:size-[3.3rem] text-foreground"
        aria-label="My Creative Museum — accueil"
      >
        <MuseumLogo />
        <span className="brand-name text-[0.72rem] font-semibold leading-[1.08] tracking-[-0.04em] lg:text-[0.9rem]">
          my creative
          <br />
          museum
        </span>
      </TransitionLink>
      <div className="header-actions flex shrink-0 items-center gap-0 sm:gap-2 lg:gap-8">
        <button
          type="button"
          className="search-button grid size-11 place-items-center lg:size-8 [&>svg]:w-[1.2rem]"
          onClick={openSearch}
          aria-label="Rechercher une œuvre"
        >
          <Icon name="search" />
        </button>
        <AccountLink />
        <Menu />
      </div>
      <SearchDialog
        dialog={dialog}
        onClose={closeSearch}
        input={input}
        query={query}
        setQuery={setQuery}
        results={results}
      />
    </header>
  );
}
