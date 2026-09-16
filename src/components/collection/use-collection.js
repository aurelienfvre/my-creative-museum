"use client";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { matchesSearch } from "@/lib/search";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function useCollection(objects) {
  const params = useSearchParams();
  const scope = useRef(null);
  const query = params.get("q") || "";
  const movement = params.get("mouvement") || "";
  const artist = params.get("artiste") || "";
  const sort = params.get("tri") || "selection";
  const movements = [
    ...new Set(objects.map((object) => object.movement).filter(Boolean)),
  ].sort();
  const artists = [
    ...new Set(objects.map((object) => object.artist).filter(Boolean)),
  ].sort();
  const filtered = objects.filter(
    (object) =>
      matchesSearch(object, query) &&
      (!movement || object.movement === movement) &&
      (!artist || object.artist === artist),
  );
  if (sort === "ancien") filtered.sort((a, b) => a.year - b.year);
  if (sort === "recent") filtered.sort((a, b) => b.year - a.year);
  if (sort === "titre") filtered.sort((a, b) => a.title.localeCompare(b.title));
  const signature = filtered.map((object) => object.id).join(",");
  function change(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      "",
      `/collection${next.size ? `?${next}` : ""}`,
    );
  }
  function reset() {
    window.history.replaceState(null, "", "/collection");
  }
  useGSAP(
    () => {
      if (
        useMuseumStore.getState().isFirstRender ||
        document.documentElement.dataset.restoredPage === "/collection" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      gsap.fromTo(
        ".artwork-card",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.035,
          ease: "museum",
          clearProps: "transform,opacity",
        },
      );
    },
    { scope, dependencies: [signature], revertOnUpdate: true },
  );
  return {
    scope,
    query,
    movement,
    artist,
    sort,
    movements,
    artists,
    filtered,
    change,
    reset,
  };
}
