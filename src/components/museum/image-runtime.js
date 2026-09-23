import * as THREE from "three";
import { useMuseumStore } from "@/stores/use-museum-store";
import { createImageScene } from "./image-scene";
import { museumMotion } from "./motion.config";

export function startMuseumImage(root, src, motion) {
  const canvas = root.querySelector("canvas");
  const image = root.querySelector("[data-portrait] .artwork-image");
  const stage = canvas.parentElement;
  const scene = createImageScene(canvas);
  const { uniforms } = scene;
  const pointer = new THREE.Vector2(0.5, 0.5);
  let disposed = false,
    visible = false,
    failed = false,
    texture,
    touch = 0,
    last = 0,
    animation = 0,
    changedAt = 0,
    dirty = true,
    previousRect,
    previousViewport,
    previousProgress = -1;
  const canRender = () =>
    !disposed &&
    !failed &&
    visible &&
    texture &&
    !document.hidden &&
    !useMuseumStore.getState().isTransitionActive;
  const stop = () => {
    cancelAnimationFrame(animation);
    animation = 0;
  };
  const frame = (now) => {
    animation = 0;
    if (!canRender()) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const progress = motion.progress;
    if (progress >= 1) {
      uniforms.uVelocity.value = 0;
      uniforms.uTouch.value = 0;
      if (root.dataset.webgl !== "settled") {
        root.dataset.webgl = "settled";
        canvas.setAttribute("aria-hidden", "true");
        image.removeAttribute("aria-hidden");
      }
      if (now - changedAt < museumMotion.scrub * 1000 + 100)
        animation = requestAnimationFrame(frame);
      return;
    }
    const active = progress > 0;
    const damping = scene.update(
      progress,
      active ? motion.velocity : 0,
      active ? touch : 0,
      pointer,
      dt,
    );
    motion.velocity *= Math.exp(-dt * 6);
    const rect = image.getBoundingClientRect();
    const viewport = canvas.getBoundingClientRect();
    const moved = ["left", "top", "width", "height"].some(
      (key) =>
        rect[key] !== previousRect?.[key] ||
        viewport[key] !== previousViewport?.[key],
    );
    if (dirty || moved || damping || progress !== previousProgress) {
      scene.render(rect, viewport);
      dirty = false;
      previousRect = rect;
      previousViewport = viewport;
      previousProgress = progress;
    }
    if (root.dataset.webgl !== "ready") {
      root.dataset.webgl = "ready";
      canvas.removeAttribute("aria-hidden");
      image.setAttribute("aria-hidden", "true");
    }
    if (damping || now - changedAt < museumMotion.scrub * 1000 + 100)
      animation = requestAnimationFrame(frame);
  };
  const wake = () => {
    dirty = true;
    changedAt = performance.now();
    if (canRender() && !animation) animation = requestAnimationFrame(frame);
  };
  const move = (event) => {
    if (
      event.pointerType !== "mouse" ||
      motion.progress <= 0 ||
      motion.progress >= 1
    )
      return;
    touch = scene.point(event, pointer);
    wake();
  };
  const leave = () => {
    if (!touch) return;
    touch = 0;
    wake();
  };
  const refreshVisibility = () => {
    if (canRender()) wake();
    else stop();
  };
  const contextLost = () => {
    failed = true;
    stop();
    delete root.dataset.webgl;
    canvas.setAttribute("aria-hidden", "true");
    image.removeAttribute("aria-hidden");
  };
  const observer = new ResizeObserver(() => {
    if (disposed || failed) return;
    scene.resize();
    wake();
  });
  observer.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refreshVisibility();
  });
  visibility.observe(canvas);
  const unsubscribe = useMuseumStore.subscribe((state, previous) => {
    if (state.isTransitionActive !== previous.isTransitionActive)
      refreshVisibility();
  });
  window.addEventListener("scroll", wake, { passive: true });
  stage.addEventListener("pointermove", move, { passive: true });
  stage.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", refreshVisibility);
  const textureWidth = window.innerWidth < 1024 ? 1200 : 1920;
  new THREE.TextureLoader().load(
    `/_next/image?url=${encodeURIComponent(src)}&w=${textureWidth}&q=75`,
    (loaded) => {
      if (disposed || failed) {
        loaded.dispose();
        return;
      }
      texture = loaded;
      texture.colorSpace = THREE.SRGBColorSpace;
      uniforms.uImage.value = texture;
      wake();
    },
  );
  scene.resize();
  return () => {
    disposed = true;
    stop();
    unsubscribe();
    image.removeAttribute("aria-hidden");
    canvas.setAttribute("aria-hidden", "true");
    observer.disconnect();
    visibility.disconnect();
    window.removeEventListener("scroll", wake);
    document.removeEventListener("visibilitychange", refreshVisibility);
    canvas.removeEventListener("webglcontextlost", contextLost);
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerleave", leave);
    texture?.dispose();
    scene.dispose();
  };
}
