"use client";
import { useEffect, useRef, useState } from "react";
import { createDinoEngine } from "./dino-engine";
import { createRun } from "./runner-model.mjs";

export function useDinoGame(canvas, area) {
  const game = useRef(createRun());
  const controls = useRef({});
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    const engine = createDinoEngine(ctx, game, setStatus, setScore, setBest);
    controls.current = engine;
    const visibility = () => {
      if (document.hidden) engine.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) engine.pause();
    });
    observer.observe(area.current);
    window.addEventListener("blur", engine.pause);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      engine.stop();
      observer.disconnect();
      window.removeEventListener("blur", engine.pause);
      document.removeEventListener("visibilitychange", visibility);
      controls.current = {};
    };
  }, [canvas, area]);
  return { controls, status, score, best };
}
