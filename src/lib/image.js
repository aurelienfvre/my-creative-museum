import { getImageProps } from "next/image";

export function getTextureImageSrc(src, width) {
  const { props } = getImageProps({
    src,
    alt: "",
    width,
    height: width,
    quality: 75,
  });
  // The GPU resolution is already capped; use the 1x candidate, not Next's 2x src.
  const source = props.srcSet
    ?.split(", ")
    .find((entry) => entry.endsWith(" 1x"));
  return source ? source.slice(0, -3) : props.src;
}
