import * as THREE from "three";

export function createCarouselScene(works, state) {
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

  return {
    radius,
    step,
    width,
    height,
    scene,
    camera,
    cylinder,
    geometry,
    materials,
    shaders,
    meshes,
  };
}
