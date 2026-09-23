import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import DinoGame from "@/components/not-found/dino-game";
import Icon from "@/components/ui/icon";
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="not-found-page page-gutter min-h-[calc(100svh_-_5rem)] pt-8 pb-12 text-ink lg:min-h-[91svh] lg:pt-16 lg:pb-20"
    >
      <div className="flex items-baseline gap-8 max-lg:flex-col max-lg:items-start max-lg:gap-[.8rem]">
        <h1 className="text-[clamp(6rem,13vw,12rem)] font-normal leading-none tracking-[-.08em]">
          404
        </h1>
        <p className="min-w-0 font-editorial text-[clamp(1.75rem,6.5vw,2.8rem)] leading-[1.1] lg:text-[2.8rem]">
          Cette page a disparu.
          <br />
          Lui aussi, normalement.
        </p>
      </div>
      <DinoGame />
      <TransitionLink
        href="/collection"
        className="text-link mt-8 min-h-11 text-[14px] lg:mt-12 lg:min-h-0 lg:text-[.82rem]"
      >
        <FlipText>Retrouver la collection</FlipText>{" "}
        <Icon name="arrowUpRight" />
      </TransitionLink>
    </main>
  );
}
