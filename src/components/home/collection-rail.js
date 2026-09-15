"use client";
import { useRef, useState } from "react";
import * as THREE from "three";
import TransitionLink from "@/components/animation/transition-link";
import ArtworkImage from "@/components/artwork/artwork-image";
import { gsap, useGSAP } from "@/lib/gsap";
import "./collection-rail.css";

export default function CollectionRail({ works }) {
  const scope = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (works.length < 2) return;
          const root = scope.current;
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
          let pending = 0;
          const state = { angle: 0, velocity: 0 };
          const radius = 7;
          const step = (Math.PI * 2) / works.length;
          const width = radius * step * 0.88;
          const height = 2.05;
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
          camera.position.z = 4.2;
          const cylinder = new THREE.Group();
          cylinder.position.z = -radius;
          const tilt = new THREE.Group();
          tilt.rotation.z = -0.105;
          tilt.add(cylinder);
          scene.add(tilt);
          const geometry = new THREE.PlaneGeometry(width, height, 24, 12);
          const positions = geometry.attributes.position;
          for (let index = 0; index < positions.count; index++) {
            const x = positions.getX(index);
            positions.setXYZ(
              index,
              radius * Math.sin(x / radius),
              positions.getY(index),
              radius * (Math.cos(x / radius) - 1),
            );
          }
          geometry.computeVertexNormals();
          const materials = [];
          const textures = [];
          const shaders = [];
          const meshes = works.map((_work, index) => {
            const material = new THREE.MeshBasicMaterial({ color: "#d9d7cd" });
            material.onBeforeCompile = (shader) => {
              shader.uniforms.uVelocity = { value: state.velocity };
              shader.vertexShader =
                `uniform float uVelocity;\n${shader.vertexShader}`.replace(
                  "#include <begin_vertex>",
                  `#include <begin_vertex>
            float wave = sin(uv.y * 3.14159265);
            transformed.x += wave * uVelocity * 0.075;
            transformed.z += sin(uv.x * 3.14159265) * wave * uVelocity * 0.085;`,
                );
              shaders[index] = shader;
            };
            materials.push(material);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
              Math.sin(index * step) * radius,
              0,
              Math.cos(index * step) * radius,
            );
            mesh.rotation.y = index * step;
            mesh.userData.index = index;
            cylinder.add(mesh);
            return mesh;
          });
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
                `/_next/image?url=${encodeURIComponent(works[index].image)}&w=640&q=75`,
                (texture) => {
                  pending--;
                  if (disposed) {
                    texture.dispose();
                    return;
                  }
                  texture.colorSpace = THREE.SRGBColorSpace;
                  const imageAspect =
                    texture.image.width / texture.image.height;
                  const frameAspect = width / height;
                  if (imageAspect > frameAspect) {
                    texture.repeat.x = frameAspect / imageAspect;
                    texture.offset.x = (1 - texture.repeat.x) / 2;
                  } else {
                    texture.repeat.y = imageAspect / frameAspect;
                    texture.offset.y = (1 - texture.repeat.y) / 2;
                  }
                  textures.push(texture);
                  materials[index].map = texture;
                  materials[index].color.set("white");
                  materials[index].needsUpdate = true;
                  render();
                },
                undefined,
                () => {
                  pending--;
                  if (!disposed) loadNearby(Math.round(-state.angle / step));
                },
              );
            }
          };
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
            loadNearby(center);
            renderer.render(scene, camera);
          };
          const resize = () => {
            camera.aspect =
              viewport.clientWidth / Math.max(1, viewport.clientHeight);
            // Maintain an edge-to-edge cylinder even on wide, short viewports.
            camera.zoom = Math.max(1.2, camera.aspect / 2.1);
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(
              viewport.clientWidth,
              viewport.clientHeight,
              false,
            );
            render();
          };
          root.classList.add("has-webgl-carousel");
          const bend = gsap.quickTo(state, "velocity", {
            duration: 0.7,
            ease: "power3.out",
            onUpdate: render,
          });
          const travel = gsap.to(state, {
            angle: -(works.length - 1) * step,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${window.innerHeight * 5}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                bend(gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / 1800)),
              onScrubComplete: () => bend(0),
              onLeave: () => bend(0),
              onLeaveBack: () => bend(0),
            },
          });
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const hit = (event) => {
            const rect = canvas.getBoundingClientRect();
            pointer.set(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              (-(event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            raycaster.setFromCamera(pointer, camera);
            return raycaster.intersectObjects(meshes, false)[0]?.object.userData
              .index;
          };
          const pointerMove = (event) => {
            if (hit(event) !== undefined) canvas.dataset.cursor = "artwork";
            else delete canvas.dataset.cursor;
          };
          const click = (event) => {
            const index = hit(event);
            if (index !== undefined)
              links[index].dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  ctrlKey: event.ctrlKey,
                  metaKey: event.metaKey,
                  shiftKey: event.shiftKey,
                }),
              );
          };
          const focus = (event) => {
            const index = links.indexOf(
              event.target.closest(".museum-carousel-card"),
            );
            if (index < 0) return;
            const trigger = travel.scrollTrigger;
            trigger.scroll(
              trigger.start +
                (index / (works.length - 1)) * (trigger.end - trigger.start),
            );
          };
          canvas.addEventListener("pointermove", pointerMove);
          canvas.addEventListener("click", click);
          root.addEventListener("focusin", focus);
          const observer = new ResizeObserver(resize);
          observer.observe(viewport);
          resize();
          return () => {
            disposed = true;
            observer.disconnect();
            canvas.removeEventListener("pointermove", pointerMove);
            canvas.removeEventListener("click", click);
            root.removeEventListener("focusin", focus);
            root.classList.remove("has-webgl-carousel");
            delete canvas.dataset.cursor;
            geometry.dispose();
            for (const material of materials) material.dispose();
            for (const texture of textures) texture.dispose();
            renderer.dispose();
          };
        },
      );
      return () => media.revert();
    },
    {
      scope,
      dependencies: [works.map((work) => work.slug).join("|")],
      revertOnUpdate: true,
    },
  );
  const active = works[activeIndex] || works[0];
  return (
    <section
      className="museum-carousel"
      ref={scope}
      aria-label="Toute la collection"
    >
      <div className="museum-carousel-heading page-gutter">
        <h2>
          À perte de <em>vue.</em>
        </h2>
      </div>
      <div className="museum-carousel-stage">
        <canvas
          role="img"
          aria-label="Carrousel des œuvres en trois dimensions"
        />
      </div>
      {active && (
        <div className="museum-carousel-caption">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {works.length}
          </span>
          <TransitionLink href={`/oeuvres/${active.slug}`}>
            {active.title}
          </TransitionLink>
        </div>
      )}
      <div className="museum-carousel-fallback">
        {works.map((work, index) => (
          <TransitionLink
            className="museum-carousel-card"
            key={work.slug}
            href={`/oeuvres/${work.slug}`}
            data-cursor="artwork"
          >
            <ArtworkImage
              src={work.image}
              title={work.title}
              sizes="(max-width: 1023px) 65vw, 30vw"
            />
            <span>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {work.title}
            </span>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
