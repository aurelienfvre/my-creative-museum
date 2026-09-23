"use client";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
export default function ErrorPage({ reset }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="empty-state page-gutter min-h-[calc(100svh_-_5rem)] py-10 lg:py-16"
    >
      <p className="eyebrow">Une petite pause</p>
      <h1 className="my-6 max-w-[20ch] text-balance text-[clamp(1.875rem,5vw,2.25rem)] leading-[1.15] lg:text-4xl">
        La collection se fait attendre.
      </h1>
      <p className="max-w-[38rem] text-base leading-relaxed">
        Nous n’avons pas pu charger les œuvres. Vous pouvez réessayer dans un
        instant.
      </p>
      <button
        type="button"
        onClick={reset}
        className="text-link mt-6 min-h-11 text-[14px] lg:text-[.82rem]"
      >
        <FlipText>Réessayer</FlipText> <Icon name="arrowUpRight" />
      </button>
      <p className="mt-8">
        <TransitionLink
          href="/"
          className="inline-flex min-h-11 items-center text-[14px] lg:text-base"
        >
          <FlipText>Retour à l’accueil</FlipText>
        </TransitionLink>
      </p>
    </main>
  );
}
