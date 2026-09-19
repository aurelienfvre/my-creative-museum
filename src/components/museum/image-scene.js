import * as THREE from "three";
import { fragmentShader, vertexShader } from "./image-shaders";

export function createImageScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
  camera.position.z = 3;
  const uniforms = {
    uImage: { value: null },
    uProgress: { value: 0 },
    uVelocity: { value: 0 },
    uTouch: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uCover: { value: new THREE.Vector2(1, 1) },
  };
  const geometry = new THREE.PlaneGeometry(1, 1, 64, 40);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  return {
    renderer,
    uniforms,
    point(event, pointer) {
      const rect = canvas.getBoundingClientRect();
      mouse.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((event.clientY - rect.top) / rect.height) * 2,
      );
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(mesh)[0];
      if (hit) pointer.copy(hit.uv);
      return hit ? 1 : 0;
    },
    resize() {
      const width = canvas.clientWidth,
        height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    update(progress, velocity, touch, pointer, dt) {
      uniforms.uProgress.value = progress;
      for (const [key, target] of [
        ["uVelocity", velocity],
        ["uTouch", touch],
      ]) {
        uniforms[key].value = THREE.MathUtils.damp(
          uniforms[key].value,
          target,
          6,
          dt,
        );
      }
      uniforms.uPointer.value.lerp(pointer, 1 - Math.exp(-dt * 5));
    },
    render(rect, viewport) {
      const height = 2 * Math.tan(THREE.MathUtils.degToRad(20)) * 3;
      const unit = height / viewport.height;
      const aspect = rect.width / rect.height;
      const texture = uniforms.uImage.value.image;
      const textureAspect = texture.width / texture.height;
      uniforms.uCover.value.set(
        Math.min(1, aspect / textureAspect),
        Math.min(1, textureAspect / aspect),
      );
      mesh.scale.set(rect.width * unit, rect.height * unit, 1);
      mesh.position.set(
        (rect.left - viewport.left + rect.width / 2 - viewport.width / 2) *
          unit,
        -(rect.top - viewport.top + rect.height / 2 - viewport.height / 2) *
          unit,
        0,
      );
      renderer.render(scene, camera);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
