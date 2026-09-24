import * as THREE from "three";
import { passageMotion } from "./motion.config";
import { passageContent } from "./museum-content";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0., 1.);
  }
`;

const fragmentShader = `
  uniform sampler2D uImage;
  uniform float uProgress;
  uniform float uLight, uTouch, uLightWidth, uLightIntensity;
  uniform vec2 uTexel, uContain;
  uniform vec3 uPaper, uInk;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
      mix(hash(i + vec2(0., 1.)), hash(i + 1.), f.x), f.y);
  }
  float grain(vec2 p) {
    return noise(p) * .57 + noise(p * 2.1) * .28 + noise(p * 4.3) * .15;
  }
  float light(vec2 uv) { return dot(texture2D(uImage, uv).rgb, vec3(.2126, .7152, .0722)); }
  void main() {
    vec2 uv = (vUv - .5) * uContain + .5;
    if (any(lessThan(uv, vec2(0.))) || any(greaterThan(uv, vec2(1.)))) discard;
    vec3 original = texture2D(uImage, uv).rgb;
    float luma = dot(original, vec3(.2126, .7152, .0722));
    vec2 gradient = vec2(
      light(uv + vec2(uTexel.x, 0.)) - light(uv - vec2(uTexel.x, 0.)),
      light(uv + vec2(0., uTexel.y)) - light(uv - vec2(0., uTexel.y))
    );
    float edges = smoothstep(.025, .2, length(gradient));
    float dark = 1. - smoothstep(.025, .22, luma);
    float paperGrain = (noise(uv / uTexel * .65) - .5) * .025;
    vec3 key = mix(uPaper + paperGrain, uInk, min(.9, edges * .78 + dark * .22));
    float pigment = clamp((original.r - original.b) * 3. + dark * .5, 0., 1.);
    float field = .08 + .82 * (.46 * (1. - uv.y) + .3 * uv.x + .24 * grain(uv * 9.));
    float gold = smoothstep(field - .07, field + .07, uProgress * 1.8);
    float colorField = .1 + .8 * (.55 * uv.x + .25 * (1. - uv.y) + .2 * grain(uv * 7. + 13.));
    float color = smoothstep(colorField - .08, colorField + .08, (uProgress - .27) * 1.6);
    vec3 printColor = mix(key, mix(key, original, pigment), gold);
    printColor = mix(printColor, original, color);
    printColor = mix(printColor, original, smoothstep(.88, .98, uProgress));
    float sweep = smoothstep(.38, 1., uProgress);
    float lightX = mix(mix(-.3, 1.4, sweep), uLight, uTouch);
    float band = exp(-pow((uv.x + uv.y * .16 - lightX) / uLightWidth, 2.));
    float metal = smoothstep(.035, .2, original.r - original.b) * smoothstep(.08, .4, luma);
    float energy = max(sin(sweep * 3.14159265) * .75, uTouch) * smoothstep(.3, .65, uProgress);
    printColor += vec3(1., .72, .32) * band * metal * energy * uLightIntensity * (.65 + edges * .35);
    printColor = mix(printColor, original, smoothstep(.94, 1., uProgress));
    gl_FragColor = vec4(printColor, 1.);
    #include <colorspace_fragment>
  }
`;

export function createInkPassage(canvas, image, onUnavailable) {
  const mobile = matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
  const pixelRatio = () => Math.min(window.devicePixelRatio, mobile ? 1 : 1.5);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: true,
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(pixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let source = image;
  if (mobile && Math.max(image.naturalWidth, image.naturalHeight) > 640) {
    source = document.createElement("canvas");
    const scale = 640 / Math.max(image.naturalWidth, image.naturalHeight);
    source.width = Math.round(image.naturalWidth * scale);
    source.height = Math.round(image.naturalHeight * scale);
    source.getContext("2d").drawImage(image, 0, 0, source.width, source.height);
  }
  const texture = new THREE.Texture(source);
  if (mobile) {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
  }
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const uniforms = {
    uImage: { value: texture },
    uProgress: { value: 0 },
    uLight: { value: 0.5 },
    uTouch: { value: 0 },
    uLightWidth: { value: passageMotion.light.width },
    uLightIntensity: { value: passageMotion.light.intensity },
    uTexel: { value: new THREE.Vector2(1 / source.width, 1 / source.height) },
    uContain: { value: new THREE.Vector2(1, 1) },
    uPaper: { value: new THREE.Color(passageContent.paper) },
    uInk: { value: new THREE.Color(passageContent.ink) },
  };
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    toneMapped: false,
  });
  scene.add(new THREE.Mesh(geometry, material));
  let lost = false,
    disposed = false,
    visible = true;
  let animation = 0,
    last = 0,
    targetLight = 0.5,
    targetTouch = 0;
  let previousFrame,
    shaderFailed = false;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
  };
  const render = (progress = uniforms.uProgress.value) => {
    uniforms.uProgress.value = progress;
    if (lost || disposed || shaderFailed) return;
    if (progress >= 1) {
      cancelAnimationFrame(animation);
      animation = 0;
      targetTouch = 0;
      uniforms.uTouch.value = 0;
      canvas.style.opacity = "0";
      previousFrame = undefined;
      return;
    }
    if (!visible || document.hidden) return;
    const state = [progress, uniforms.uLight.value, uniforms.uTouch.value];
    if (state.every((value, index) => value === previousFrame?.[index])) return;
    renderer.render(scene, camera);
    previousFrame = state;
    canvas.style.opacity = shaderFailed ? "0" : "1";
  };
  const resize = () => {
    const width = Math.max(1, canvas.clientWidth),
      height = Math.max(1, canvas.clientHeight);
    const ratio = pixelRatio();
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    const imageAspect = image.naturalWidth / image.naturalHeight;
    uniforms.uContain.value.set(
      Math.max(1, width / height / imageAspect),
      Math.max(1, imageAspect / (width / height)),
    );
    renderer.setSize(width, height, false);
    previousFrame = undefined;
    render();
  };
  const contextLost = () => {
    lost = true;
    canvas.style.opacity = "0";
    onUnavailable();
  };
  const frame = canvas.parentElement;
  const canAnimate = () =>
    !disposed &&
    !lost &&
    visible &&
    !document.hidden &&
    uniforms.uProgress.value < 1;
  const tick = (now) => {
    animation = 0;
    if (!canAnimate()) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    for (const [key, target] of [
      ["uLight", targetLight],
      ["uTouch", targetTouch],
    ]) {
      uniforms[key].value = THREE.MathUtils.damp(
        uniforms[key].value,
        target,
        passageMotion.light.damping,
        dt,
      );
    }
    render();
    const distance =
      Math.abs(uniforms.uLight.value - targetLight) +
      Math.abs(uniforms.uTouch.value - targetTouch);
    if (!disposed && distance > 0.001) animation = requestAnimationFrame(tick);
  };
  const move = (event) => {
    if (event.pointerType !== "mouse" || !canAnimate()) return;
    const rect = frame.getBoundingClientRect();
    targetLight = (event.clientX - rect.left) / rect.width + 0.08;
    targetTouch = 1;
    if (!animation) animation = requestAnimationFrame(tick);
  };
  const leave = () => {
    targetTouch = 0;
    if (!canAnimate()) return;
    if (!animation) animation = requestAnimationFrame(tick);
  };
  frame.addEventListener("pointermove", move);
  frame.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", contextLost);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const refreshVisibility = () => {
    if (canAnimate()) {
      render();
      animation ||= requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animation);
      animation = 0;
    }
  };
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refreshVisibility();
  });
  visibility.observe(canvas);
  document.addEventListener("visibilitychange", refreshVisibility);
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(animation);
    frame.removeEventListener("pointermove", move);
    frame.removeEventListener("pointerleave", leave);
    observer.disconnect();
    visibility.disconnect();
    document.removeEventListener("visibilitychange", refreshVisibility);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.style.opacity = "0";
    for (const resource of [geometry, material, texture, renderer])
      resource.dispose();
  };
  try {
    resize();
    if (shaderFailed) throw new Error("Ink shader unavailable");
  } catch {
    dispose();
    return null;
  }
  return { render, dispose };
}
