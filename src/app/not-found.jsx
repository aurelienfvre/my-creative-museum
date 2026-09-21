import FlipText from "@/components/animation/flip-text";
import TransitionLink from "@/components/animation/transition-link";
import DinoGame from "@/components/not-found/dino-game";
import Icon from "@/components/ui/icon";
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="not-found-page page-gutter min-h-[91svh] pt-16 pb-20 text-ink max-[600px]:pt-8"
    >
      <div className="flex items-baseline gap-8 max-lg:flex-col max-lg:items-start max-lg:gap-[.8rem]">
        <h1 className="text-[clamp(6rem,13vw,12rem)] font-normal leading-none tracking-[-.08em]">
          404
        </h1>
        <p className="min-w-0 font-editorial text-[2.8rem] leading-[1.1] max-[600px]:text-[2rem]">
          Cette page a disparu.
          <br />
          Lui aussi, normalement.
        </p>
      </div>
      <DinoGame />
      <TransitionLink href="/collection" className="text-link mt-12">
        <FlipText>Retrouver la collection</FlipText>{" "}
        <Icon name="arrowUpRight" />
      </TransitionLink>
    </main>
  );
}
