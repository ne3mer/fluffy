import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const FurMaterial = shaderMaterial(
  {
    uTime: 0,
    uLayer: 0,
    uTotalLayers: 20,
    uColorTop: new THREE.Color('#a855f7'), // Purple
    uColorBottom: new THREE.Color('#db2777'), // Pink
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vLayerProp;
    uniform float uTime;
    uniform float uLayer;
    uniform float uTotalLayers;

    void main() {
      vUv = uv;
      vLayerProp = uLayer / uTotalLayers;
      
      // Expand vertices based on layer index to create shells
      // Add slight waviness for "fluff"
      float expansion = vLayerProp * 0.2; 
      vec3 newPos = position + normal * expansion;
      
      // Wind/Movement effect
      float wind = sin(uTime * 2.0 + position.x * 5.0 + position.y * 5.0) * 0.02 * vLayerProp;
      newPos.x += wind;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vLayerProp;
    uniform vec3 uColorTop;
    uniform vec3 uColorBottom;

    // Simple noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Create noise pattern for fur density
      // We scale UVs to make widespread strands
      vec2 st = vUv * 100.0; // Higher number = finer fur
      float noiseVal = random(floor(st)); 
      
      // Threshold based on layer depth
      // Inner layers (low vLayerProp) are dense, outer layers are sparse
      // We want distinct strands at the tips
      float threshold = 0.5 + vLayerProp * 0.45; // 0.5 to 0.95
      
      // Alpha Test / Cutout
      if (noiseVal < threshold) discard;
      
      // Color: Gradient from Texture UV
      vec3 finalColor = mix(uColorBottom, uColorTop, vUv.y);
      
      // Shadowing for depth: Inner layers darker
      float shadow = 0.5 + 0.5 * vLayerProp;
      finalColor *= shadow;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ FurMaterial })

export { FurMaterial }
