import * as THREE from 'three';

const CRTShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(0, 0) },
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;

      // discard outside barrel
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // chromatic aberration
      float ca = 0.0000;
      float r = texture2D(tDiffuse, uv + vec2( ca, 0.0)).r;
      float g = texture2D(tDiffuse, uv              ).g;
      float b = texture2D(tDiffuse, uv - vec2( ca, 0.0)).b;
      vec3 color = vec3(r, g, b);

      // scanlines
      float line = mod(floor(uv.y * resolution.y), 2.0);
      color *= 1.0 - 0.16 * line;

      // vignette
      vec2 vc = vUv - 0.5;
      float vignette = 1.0 - dot(vc, vc) * 0.6;
      color *= clamp(vignette, 0.0, 1.0);

      // subtle noise
      float noise = rand(uv + fract(time * 0.1)) * 0.005;
      color += noise;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default CRTShader;
