import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import DinoGame from "@/components/not-found/dino-game";
import Icon from "@/components/ui/icon";
export default function NotFound() {
  return (
    <main id="main" className="not-found-page page-gutter">
      <div className="not-found-heading">
        <h1>404</h1>
        <p>
          Cette page a disparu.
          <br />
          Lui aussi, normalement.
        </p>
      </div>
      <DinoGame />
      <TransitionLink href="/collection" className="text-link">
        <FlipText>Retrouver la collection</FlipText>{" "}
        <Icon name="arrowUpRight" />
      </TransitionLink>
    </main>
  );
}
