"use client";
import { useRef } from "react";
import { useDinoGame } from "./use-dino-game";

export default function DinoGame() {
  const canvas = useRef(null);
  const area = useRef(null);
  const { controls, status, score, best } = useDinoGame(canvas, area);
  return (
    <section
      className="dino-game mx-auto mt-10 w-full max-w-[60rem]"
      ref={area}
      aria-label="Jeu du dinosaure"
    >
      <div className="flex justify-end gap-8 font-mono text-[.7rem]">
        <span>Score {String(score).padStart(4, "0")}</span>
        <span>Record {String(best).padStart(4, "0")}</span>
      </div>
      <button
        className="dino-field block w-full touch-manipulation border-0 bg-transparent p-0 max-[600px]:overflow-hidden max-[600px]:py-8"
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
      <div className="flex items-baseline justify-between gap-4 max-[600px]:items-start">
        <p
          className="text-[.75rem] text-muted max-[600px]:max-w-[13rem]"
          aria-live="polite"
        >
          {status === "over"
            ? "Raté. Encore une petite course ?"
            : status === "paused"
              ? "La course est en pause."
              : "Espace, flèche haut ou un tap pour sauter."}
        </p>
        <button
          className="min-h-11 bg-ink px-[1.4rem] py-[.7rem] text-[.8rem] text-background"
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
