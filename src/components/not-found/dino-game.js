"use client";
import { useEffect, useRef, useState } from "react";
import { advance, createRun, jump } from "./runner-model.mjs";
import "./dino-game.css";

const sprite = [
  "000001111110",
  "000001101110",
  "000001111110",
  "000001110000",
  "100011111000",
  "110111110000",
  "111111110000",
  "011111100000",
  "001111000000",
  "001001000000",
];
export default function DinoGame() {
  const canvas = useRef(null);
  const area = useRef(null);
  const game = useRef(createRun());
  const controls = useRef({});
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    let frame = 0,
      last = 0,
      active = false,
      record = 0;
    try {
      record = Number(localStorage.getItem("museum-dino-best")) || 0;
      setBest(record);
    } catch {}
    const draw = () => {
      const run = game.current;
      ctx.clearRect(0, 0, 840, 250);
      ctx.fillStyle = "#243bba";
      ctx.fillRect(0, 206, 840, 1);
      for (let x = 0; x < 900; x += 64)
        ctx.fillRect(x - ((run.distance * 0.5) % 64), 219 + (x % 3) * 5, 8, 1);
      sprite.forEach((row, y) => {
        [...row].forEach((pixel, x) => {
          if (pixel === "1")
            ctx.fillRect(76 + x * 4, 160 - run.y + y * 4, 4, 4);
        });
      });
      const stride =
        active && run.y === 0 ? (Math.floor(run.distance / 24) % 2) * 4 : 0;
      ctx.fillRect(84, 200 - run.y, 4, 6 - stride);
      ctx.fillRect(96, 200 - run.y, 4, 2 + stride);
      for (const item of run.obstacles) {
        ctx.fillRect(
          item.x + item.w * 0.4,
          206 - item.h,
          item.w * 0.25,
          item.h,
        );
        ctx.fillRect(item.x, 212 - item.h, 5, item.h * 0.5);
        ctx.fillRect(item.x, 206 - item.h * 0.4, item.w * 0.6, 5);
        ctx.fillRect(
          item.x + item.w * 0.65,
          206 - item.h * 0.65,
          item.w * 0.35,
          5,
        );
        ctx.fillRect(item.x + item.w - 5, 206 - item.h * 0.8, 5, item.h * 0.2);
      }
    };
    const pause = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(frame);
      setStatus("paused");
      draw();
    };
    const tick = (time) => {
      if (!active) return;
      if (
        document.hidden ||
        document.querySelector("dialog[open]") ||
        document.querySelector(".is-navigating")
      ) {
        pause();
        return;
      }
      const elapsed = Math.min((time - last) / 1000, 0.05);
      last = time;
      for (let remaining = elapsed; remaining > 0; remaining -= 1 / 120)
        advance(game.current, Math.min(1 / 120, remaining));
      draw();
      setScore(game.current.score);
      if (game.current.over) {
        active = false;
        setStatus("over");
        record = Math.max(record, game.current.score);
        setBest(record);
        try {
          localStorage.setItem("museum-dino-best", String(record));
        } catch {}
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      if (!active) {
        if (game.current.over) {
          game.current = createRun();
          setScore(0);
        }
        active = true;
        last = performance.now();
        setStatus("playing");
        frame = requestAnimationFrame(tick);
      }
      jump(game.current);
    };
    controls.current = { play, pause };
    const visibility = () => {
      if (document.hidden) pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    observer.observe(area.current);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", visibility);
    draw();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", visibility);
      controls.current = {};
    };
  }, []);
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
