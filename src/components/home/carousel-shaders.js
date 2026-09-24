export const vertexShader = `
  uniform float uVelocity;
  uniform mat3 uImageTransform;
  out vec2 vUv;
  void main() {
    vUv = (uImageTransform * vec3(uv, 1.)).xy;
    vec3 p = position;
    float wave = sin(uv.y * 3.14159265);
    p.x += wave * uVelocity * .075;
    p.z += sin(uv.x * 3.14159265) * wave * uVelocity * .085;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }
`;

export const fragmentShader = `
  uniform sampler2D uImage;
  uniform bool uHasImage;
  uniform vec3 uPlaceholder;
  in vec2 vUv;
  out vec4 fragColor;
  void main() {
    vec3 color = uPlaceholder;
    if (uHasImage) color = texture(uImage, vUv).rgb;
    #if defined(TONE_MAPPING)
      color = toneMapping(color);
    #endif
    fragColor = linearToOutputTexel(vec4(color, 1.));
  }
`;
