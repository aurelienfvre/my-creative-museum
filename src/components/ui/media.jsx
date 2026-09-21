"use client";
import NextImage from "next/image";
import { forwardRef } from "react";

const Media = forwardRef(function Media(
  {
    src,
    alt = "",
    fill = true,
    objectFit = "cover",
    objectPosition = "center",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    preload = false,
    style,
    ...props
  },
  ref,
) {
  const source = typeof src === "string" ? src : src?.src || "";
  const isVideo = /\.(mp4|webm|mov)(?:[?#]|$)/i.test(source);
  if (isVideo)
    return (
      <video
        {...props}
        ref={ref}
        src={source}
        autoPlay
        loop
        muted
        playsInline
        preload={preload ? "auto" : "metadata"}
        aria-label={alt || undefined}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          ...style,
        }}
      />
    );
  return (
    <NextImage
      {...props}
      ref={ref}
      src={src}
      alt={alt}
      fill={fill}
      preload={preload}
      sizes={sizes}
      style={{ objectFit, objectPosition, ...style }}
    />
  );
});
export default Media;
