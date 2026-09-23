"use client";
import { useRef } from "react";
import { useDinoGame } from "./use-dino-game";

export default function DinoGame() {
  const canvas = useRef(null);
  const area = useRef(null);
  const { controls, status, score, best } = useDinoGame(canvas, area);
  return (
    <section
      className="dino-game mx-auto mt-8 w-full max-w-[60rem] lg:mt-10"
      ref={area}
      aria-label="Jeu du dinosaure"
    >
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 font-mono text-[12px] sm:justify-end sm:gap-x-8 lg:text-[.7rem]">
        <span>Score {String(score).padStart(4, "0")}</span>
        <span>Record {String(best).padStart(4, "0")}</span>
      </div>
      <button
        className="dino-field block min-h-11 w-full touch-manipulation overflow-hidden border-0 bg-transparent p-0 max-[600px]:py-5"
        type="button"
        aria-label="Sauter avec le dinosaure"
        onClick={() => controls.current.play?.()}
        onKeyDown={(event) => {
          if ([" ", "ArrowUp", "Enter"].includes(event.key)) {
            event.preventDefault();
            if (!event.repeat) controls.current.play?.();
          }
        }}
      >
        <canvas
          className="block h-auto w-full max-[600px]:w-[150%] max-[600px]:max-w-none"
          ref={canvas}
          width={840}
          height={250}
        />
      </button>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 lg:items-baseline">
        <p
          className="min-w-0 text-[14px] leading-relaxed text-muted lg:text-[.75rem]"
          aria-live="polite"
        >
          {status === "over" ? (
            "Raté. Encore une petite course ?"
          ) : status === "paused" ? (
            "La course est en pause."
          ) : (
            <>
              <span className="sm:hidden">Touchez la piste pour sauter.</span>
              <span className="hidden sm:inline">
                Espace, flèche haut ou un tap pour sauter.
              </span>
            </>
          )}
        </p>
        <button
          className="min-h-11 whitespace-nowrap bg-ink px-4 py-[.7rem] text-[14px] text-background lg:px-[1.4rem] lg:text-[.8rem]"
          type="button"
          onClick={() => {
            if (status === "playing") controls.current.pause?.();
            else {
              controls.current.play?.();
              area.current
                .querySelector(".dino-field")
                .focus({ preventScroll: true });
            }
          }}
        >
          {status === "playing"
            ? "Pause"
            : status === "over"
              ? "Rejouer"
              : status === "paused"
                ? "Reprendre"
                : "Jouer"}
        </button>
      </div>
    </section>
  );
}
