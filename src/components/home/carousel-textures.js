import * as THREE from "three";
import { getTextureImageSrc } from "@/lib/image";

export function createCarouselTextures({
  works,
  state,
  step,
  width,
  height,
  materials,
  render,
  disposed,
}) {
  let pending = 0;
  const textures = [];
  const requested = new Set();
  const loader = new THREE.TextureLoader();
  const loadNearby = (center) => {
    for (const offset of [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
      if (pending >= 3) break;
      const index = (center + offset + works.length) % works.length;
      if (requested.has(index) || !works[index].image) continue;
      requested.add(index);
      pending++;
      loader.load(
        getTextureImageSrc(works[index].image, 640),
        (texture) => {
          pending--;
          if (disposed()) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          const imageAspect = texture.image.width / texture.image.height;
          const frameAspect = width / height;
          if (imageAspect > frameAspect) {
            texture.repeat.x = frameAspect / imageAspect;
            texture.offset.x = (1 - texture.repeat.x) / 2;
          } else {
            texture.repeat.y = imageAspect / frameAspect;
            texture.offset.y = (1 - texture.repeat.y) / 2;
          }
          textures.push(texture);
          texture.updateMatrix();
          const { uniforms } = materials[index];
          uniforms.uImage.value = texture;
          uniforms.uImageTransform.value.copy(texture.matrix);
          uniforms.uHasImage.value = true;
          render();
        },
        undefined,
        () => {
          pending--;
          if (!disposed()) loadNearby(Math.round(-state.angle / step));
        },
      );
    }
  };

  return {
    loadNearby,
    dispose: () => {
      for (const texture of textures) texture.dispose();
    },
  };
}
