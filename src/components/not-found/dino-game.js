"use client";
import { useRef } from "react";
import { useDinoGame } from "./use-dino-game";
import "./dino-game.css";

export default function DinoGame() {
  const canvas = useRef(null);
  const area = useRef(null);
  const { controls, status, score, best } = useDinoGame(canvas, area);
  return (
    <section className="dino-game" ref={area} aria-label="Jeu du dinosaure">
      <div className="dino-score">
        <span>Score {String(score).padStart(4, "0")}</span>
        <span>Record {String(best).padStart(4, "0")}</span>
      </div>
      <button
        className="dino-field"
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
        <canvas ref={canvas} width={840} height={250} />
      </button>
      <div className="dino-controls">
        <p aria-live="polite">
          {status === "over"
            ? "Raté. Encore une petite course ?"
            : status === "paused"
              ? "La course est en pause."
              : "Espace, flèche haut ou un tap pour sauter."}
        </p>
        <button
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
