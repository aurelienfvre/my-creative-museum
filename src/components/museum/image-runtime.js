import * as THREE from "three";
import { useMuseumStore } from "@/stores/use-museum-store";
import { createImageScene } from "./image-scene";

export function startMuseumImage(root, src, motion) {
  const canvas = root.querySelector("canvas");
  const image = root.querySelector("[data-portrait] .artwork-image");
  const stage = canvas.parentElement;
  const scene = createImageScene(canvas);
  const { renderer, uniforms } = scene;
  const pointer = new THREE.Vector2(0.5, 0.5);
  let disposed = false,
    visible = false,
    texture,
    touch = 0,
    last = 0;
  const move = (event) => {
    touch = scene.point(event, pointer);
  };
  const leave = () => {
    touch = 0;
  };
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerleave", leave);
  const observer = new ResizeObserver(() => scene.resize());
  observer.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(canvas);
  new THREE.TextureLoader().load(
    `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`,
    (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      texture = loaded;
      texture.colorSpace = THREE.SRGBColorSpace;
      uniforms.uImage.value = texture;
    },
  );
  renderer.setAnimationLoop((now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (
      !visible ||
      !texture ||
      document.hidden ||
      useMuseumStore.getState().isTransitionActive
    )
      return;
    const progress = motion.progress;
    if (progress >= 1) {
      uniforms.uVelocity.value = 0;
      uniforms.uTouch.value = 0;
      root.dataset.webgl = "settled";
      canvas.setAttribute("aria-hidden", "true");
      image.removeAttribute("aria-hidden");
      return;
    }
    const active = progress > 0;
    scene.update(
      progress,
      active ? motion.velocity : 0,
      active ? touch : 0,
      pointer,
      dt,
    );
    motion.velocity *= Math.exp(-dt * 6);
    scene.render(image.getBoundingClientRect(), canvas.getBoundingClientRect());
    if (root.dataset.webgl !== "ready") {
      root.dataset.webgl = "ready";
      canvas.removeAttribute("aria-hidden");
      image.setAttribute("aria-hidden", "true");
    }
  });
  scene.resize();
  return () => {
    disposed = true;
    image.removeAttribute("aria-hidden");
    canvas.setAttribute("aria-hidden", "true");
    observer.disconnect();
    visibility.disconnect();
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerleave", leave);
    texture?.dispose();
    scene.dispose();
  };
}
