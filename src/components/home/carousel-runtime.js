import * as THREE from "three";
import { bindCarouselInteractions } from "./carousel-interactions";
import { createCarouselMotion } from "./carousel-motion";
import { createCarouselScene } from "./carousel-scene";
import { createCarouselTextures } from "./carousel-textures";

export function startCarousel(root, works, setActiveIndex) {
  const viewport = root.querySelector(".museum-carousel-stage");
  const canvas = root.querySelector("canvas");
  const links = [...root.querySelectorAll(".museum-carousel-card")];
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
  } catch {
    return;
  }
  let disposed = false;
  let displayed = -1;
  const state = { angle: 0, velocity: 0 };
  const sceneParts = createCarouselScene(works, state);
  const {
    scene,
    camera,
    cylinder,
    geometry,
    materials,
    shaders,
    meshes,
    step,
  } = sceneParts;
  const render = () => {
    if (disposed) return;
    cylinder.rotation.y = state.angle;
    for (const shader of shaders)
      if (shader) shader.uniforms.uVelocity.value = state.velocity;
    const center = Math.min(
      works.length - 1,
      Math.max(0, Math.round(-state.angle / step)),
    );
    if (displayed !== center) {
      displayed = center;
      setActiveIndex(center);
    }
    textureQueue.loadNearby(center);
    renderer.render(scene, camera);
  };
  const resize = () => {
    camera.aspect = viewport.clientWidth / Math.max(1, viewport.clientHeight);
    // Maintain an edge-to-edge cylinder even on wide, short viewports.
    camera.zoom = Math.max(1.2, camera.aspect / 2.1);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(viewport.clientWidth, viewport.clientHeight, false);
    render();
  };
  const textureQueue = createCarouselTextures({
    ...sceneParts,
    works,
    state,
    render,
    disposed: () => disposed,
  });
  root.classList.add("has-webgl-carousel");
  const travel = createCarouselMotion(root, state, works, step, render);
  const unbind = bindCarouselInteractions({
    canvas,
    camera,
    meshes,
    links,
    root,
    travel,
    works,
  });
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  resize();
  return () => {
    disposed = true;
    observer.disconnect();
    unbind();
    root.classList.remove("has-webgl-carousel");
    geometry.dispose();
    for (const material of materials) material.dispose();
    textureQueue.dispose();
    renderer.dispose();
  };
}
