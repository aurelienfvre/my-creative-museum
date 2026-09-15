import { drawDino } from "./dino-renderer";
import { advance, createRun, jump } from "./runner-model.mjs";

export function createDinoEngine(ctx, game, setStatus, setScore, setBest) {
  let frame = 0,
    last = 0,
    active = false,
    record = 0;
  try {
    record = Number(localStorage.getItem("museum-dino-best")) || 0;
    setBest(record);
  } catch {}
  const draw = () => drawDino(ctx, game.current, active);
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
  draw();
  return {
    play,
    pause,
    stop: () => {
      active = false;
      cancelAnimationFrame(frame);
    },
  };
}
