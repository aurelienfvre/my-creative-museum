export const vertexShader = `
  uniform float uProgress, uVelocity, uTouch;
  uniform vec2 uPointer;
  out vec2 vUv;
  out float vLight;
  void main() {
    vUv = uv;
    vec3 p = position;
    float turn = sin(uProgress * 3.14159);
    float wave = sin(uv.x * 3.14159 + uProgress * 3.0);
    float distanceToPointer = distance(uv, uPointer);
    float touch = exp(-distanceToPointer * distanceToPointer * 12.0) * uTouch * turn;
    p.z += wave * turn * .2;
    p.z += sin(uv.x * 4. + uv.y * 3.) * uVelocity * turn * .045;
    p.z += touch * .09;
    p.y += sin(uv.x * 3.14159) * turn * .045;
    p.x += (uv.y - .5) * uVelocity * turn * .025;
    vLight = 1. - wave * turn * .13 + touch * .09;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }
`;
export const fragmentShader = `
  uniform sampler2D uImage;
  uniform vec2 uCover;
  uniform float uProgress;
  in vec2 vUv;
  in float vLight;
  out vec4 fragColor;
  void main() {
    vec2 sampleUv = (vUv - .5) * uCover + .5;
    vec3 color = texture(uImage, sampleUv).rgb;
    vec2 q = abs(vUv - .5) - vec2(.5);
    float edge = length(max(q, 0.)) + min(max(q.x,q.y),0.);
    float alpha = 1. - smoothstep(-.002, .001, edge);
    vec4 shadedColor = vec4(color * vLight, alpha);
    #if defined(TONE_MAPPING)
      shadedColor.rgb = toneMapping(shadedColor.rgb);
    #endif
    fragColor = linearToOutputTexel(shadedColor);
  }
`;
