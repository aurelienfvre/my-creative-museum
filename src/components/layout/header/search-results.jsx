"use client";
import { useState } from "react";
import TransitionLink from "@/components/animation/transition-link";
import Media from "@/components/ui/media";
import MuseumLogo from "@/components/ui/museum-logo";
import { searchText } from "@/lib/search";

export default function SearchResults({ query, results, onNavigate }) {
  return (
    <div
      className="search-results my-[1.8rem] text-[14px] lg:text-[0.85rem]"
      aria-live="polite"
    >
      {Array.from(query.trim()).length >= 3 && (
        <>
          <p className="eyebrow font-mono text-[12px] uppercase tracking-[0.08em] lg:text-[0.7rem]">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          {results.slice(0, 6).map((object) => (
            <TransitionLink
              className="flex items-center gap-4 border-b border-line py-3 transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5"
              href={`/oeuvres/${object.slug}`}
              key={object.id}
              onClick={onNavigate}
            >
              <SearchThumbnail src={object.image} />
              <span className="min-w-0 wrap-anywhere">
                <SearchHighlight text={object.title} query={query} />
                <small className="mt-[0.2rem] block text-[14px] text-muted lg:text-[0.7rem]">
                  <SearchHighlight text={object.artist} query={query} />
                </small>
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
      )}
    </div>
  );
}

function SearchThumbnail({ src }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden bg-foreground/5 sm:size-16 lg:size-18"
      aria-hidden="true"
    >
      {src && !failed ? (
        <Media
          src={src}
          alt=""
          sizes="(min-width: 1920px) 5vw, 96px"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="size-8 text-foreground/40">
          <MuseumLogo />
        </span>
      )}
    </span>
  );
}

function SearchHighlight({ text, query }) {
  const tokens = searchText(query).split(/\s+/).filter(Boolean);
  const characters = Array.from(text);
  const offsets = [];
  let normalized = "";
  for (const [index, character] of characters.entries()) {
    const plain = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    normalized += plain;
    for (let i = 0; i < plain.length; i++) offsets.push(index);
  }
  const highlighted = new Set();
  for (const token of tokens) {
    let start = normalized.indexOf(token);
    while (start !== -1) {
      for (let i = start; i < start + token.length; i++)
        highlighted.add(offsets[i]);
      start = normalized.indexOf(token, start + 1);
    }
  }
  const parts = [];
  for (const [index, character] of characters.entries()) {
    const marked = highlighted.has(index);
    const previous = parts.at(-1);
    if (previous && previous.marked === marked) previous.text += character;
    else parts.push({ text: character, marked, start: index });
  }
  return parts.map((part) =>
    part.marked ? (
      <mark
        key={part.start}
        className="rounded-[.1em] bg-foreground/15 text-foreground [box-decoration-break:clone]"
      >
        {part.text}
      </mark>
    ) : (
      <span key={part.start}>{part.text}</span>
    ),
  );
}
