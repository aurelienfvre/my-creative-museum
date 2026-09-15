"use client";
import { useRef, useState } from "react";
import Media from "@/components/ui/media";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ArtworkImage({
  src,
  title,
  preload = false,
  eager = false,
  className = "",
  sizes = "(max-width: 1023px) 90vw, 45vw",
  contain = false,
}) {
  const [failed, setFailed] = useState(false);
  const container = useRef(null);
  const media = useRef(null);
  useGSAP(
    (_context, contextSafe) => {
      const image = media.current;
      if (!image) return;
      let cancelled = false,
        revealed = false;
      const reveal = contextSafe(() => {
        if (cancelled || revealed) return;
        revealed = true;
        gsap.to(image, {
          autoAlpha: 1,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? 0
            : 0.6,
          ease: "power2.out",
        });
      });
      const loaded = () => {
        if (image instanceof HTMLImageElement && image.decode)
          image.decode().then(reveal).catch(reveal);
        else reveal();
      };
      if (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalWidth > 0
      )
        loaded();
      image.addEventListener("load", loaded);
      image.addEventListener("loadeddata", loaded);
      return () => {
        cancelled = true;
        image.removeEventListener("load", loaded);
        image.removeEventListener("loadeddata", loaded);
      };
    },
    { scope: container, dependencies: [src, failed], revertOnUpdate: true },
  );
  return (
    <div
      ref={container}
      className={`artwork-image relative overflow-hidden bg-[#e3e3d8] ${className}`}
    >
      {src && !failed ? (
        <Media
          ref={media}
          src={src}
          alt={title}
          fill
          sizes={sizes}
          preload={preload}
          loading={eager && !preload ? "eager" : undefined}
          data-primary-media={preload ? "true" : undefined}
          className="media-content transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)]"
          objectFit={contain ? "contain" : "cover"}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="image-unavailable flex h-full min-h-48 flex-col items-center justify-center gap-4 p-8 text-center text-[.85rem] text-muted">
          <span>Reproduction momentanément indisponible</span>
          <span>{title}</span>
        </div>
      )}
    </div>
  );
}
