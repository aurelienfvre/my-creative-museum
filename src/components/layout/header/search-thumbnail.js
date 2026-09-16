"use client";
import { useState } from "react";
import Media from "@/components/ui/media";
import MuseumLogo from "@/components/ui/museum-logo";

export default function SearchThumbnail({ src }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-foreground/5 lg:size-18"
      aria-hidden="true"
    >
      {src && !failed ? (
        <Media
          src={src}
          alt=""
          sizes="(min-width: 1920px) 5vw, 96px"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="size-8 text-foreground/40">
          <MuseumLogo />
        </span>
      )}
    </span>
  );
}
