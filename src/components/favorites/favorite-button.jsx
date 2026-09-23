"use client";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import useFavorite from "./use-favorite";

export default function FavoriteButton({
  slug,
  title,
  initialSaved,
  onChange,
  compact = false,
}) {
  const { saved, loading, pending, error, session, toggle } = useFavorite(
    slug,
    initialSaved,
    onChange,
  );
  const label = loading
    ? "Un instant…"
    : saved
      ? compact
        ? "Retirer"
        : "Dans mes favoris"
      : "Garder cette œuvre";
  const style = `inline-flex min-h-12 items-center justify-center gap-3 border border-foreground px-5 py-3 text-sm transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-wait ${saved ? "bg-foreground text-white! [&_span]:text-white!" : "bg-transparent text-foreground"}`;
  if (!loading && !session)
    return (
      <TransitionLink
        href="/connexion"
        prefetch={false}
        className={style}
        aria-label="Se connecter pour garder cette œuvre"
      >
        <span className="lg:hidden" aria-hidden="true">
          Se connecter pour garder
        </span>
        <span className="hidden lg:inline">
          <FlipText>Se connecter pour garder cette œuvre</FlipText>
        </span>
      </TransitionLink>
    );
  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading || pending}
        aria-pressed={saved}
        aria-label={`${label}${title ? ` : ${title}` : ""}${saved ? " — retirer des favoris" : ""}`}
        aria-busy={pending}
        className={style}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
          className={`${saved ? "text-white!" : "text-inherit"} shrink-0 transition-transform duration-300 motion-reduce:transition-none ${saved ? "scale-110 motion-safe:animate-[favorite-pop_450ms_ease-out]" : "scale-100"}`}
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
        <span
          className={`relative block ${saved ? "text-white!" : "text-inherit"}`}
        >
          <FlipText>{label}</FlipText>
        </span>
      </button>
      {error && (
        <p role="alert" className="mt-3 max-w-sm text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
