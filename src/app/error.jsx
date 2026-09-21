"use client";
import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
export default function ErrorPage({ reset }) {
  return (
    <main id="main" className="empty-state page-gutter">
      <p className="eyebrow">Une petite pause</p>
      <h1 className="my-6 text-4xl">La collection se fait attendre.</h1>
      <p>
        Nous n’avons pas pu charger les œuvres. Vous pouvez réessayer dans un
        instant.
      </p>
      <button type="button" onClick={reset} className="text-link">
        <FlipText>Réessayer</FlipText> <Icon name="arrowUpRight" />
      </button>
      <p className="mt-8">
        <TransitionLink href="/">
          <FlipText>Retour à l’accueil</FlipText>
        </TransitionLink>
      </p>
    </main>
  );
}
