"use client";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import FlipText from "@/components/animation/flip-text";
import ArtworkCard from "@/components/artwork/artwork-card";
import Icon from "@/components/ui/icon";
import { gsap, useGSAP } from "@/lib/gsap";
import { matchesSearch } from "@/lib/search";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function Collection({ objects }) {
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
  return (
    <section
      className="page-gutter"
      ref={scope}
      aria-label="Œuvres de la collection"
    >
      <div className="collection-toolbar">
        <label className="field-label">
          Rechercher
          <input
            type="search"
            placeholder="Titre, artiste, mouvement…"
            value={query}
            onChange={(event) => change("q", event.target.value)}
          />
        </label>
        <label className="field-label">
          Mouvement
          <select
            value={movement}
            onChange={(event) => change("mouvement", event.target.value)}
          >
            <option value="">Tous les mouvements</option>
            {movements.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Artiste
          <select
            value={artist}
            onChange={(event) => change("artiste", event.target.value)}
          >
            <option value="">Tous les artistes</option>
            {artists.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Trier par
          <select
            value={sort}
            onChange={(event) => change("tri", event.target.value)}
          >
            <option value="selection">La sélection</option>
            <option value="ancien">Date croissante</option>
            <option value="recent">Date décroissante</option>
            <option value="titre">Titre A à Z</option>
          </select>
        </label>
      </div>
      <div className="collection-count">
        <p aria-live="polite">
          {filtered.length} œuvre{filtered.length > 1 ? "s" : ""} sur{" "}
          {objects.length}
        </p>
        {(query || movement || artist || sort !== "selection") && (
          <button type="button" onClick={reset}>
            <FlipText>Réinitialiser les filtres</FlipText> <Icon name="close" />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="collection-grid">
          {filtered.map((object, index) => (
            <ArtworkCard key={object.id} object={object} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Aucune rencontre, pour l’instant.</h2>
          <p>Essayez un autre artiste ou retirez un filtre.</p>
          <button className="text-link" type="button" onClick={reset}>
            <FlipText>Retrouver toute la collection</FlipText>{" "}
            <Icon name="arrowUpRight" />
          </button>
        </div>
      )}
    </section>
  );
}
