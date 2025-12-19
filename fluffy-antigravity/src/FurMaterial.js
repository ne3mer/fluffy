import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const FurMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ff69b4'),
    uLayer: 0,
    uTotalLayers: 20,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uLayer;
  uniform float uTotalLayers;
  
  void main() {
    vUv = uv;
    float delta = uLayer / uTotalLayers;
    // Displace the vertex along its normal based on which "layer" it is
    vec3 displacement = normal * delta * 0.5; 
    // Add a slight "wind" wiggle
    displacement += sin(uTime + position.y * 10.0) * 0.02 * delta;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + displacement, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  uniform float uLayer;
  uniform vec3 uColor;

  // Simple pseudo-random function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float n = hash(vUv * 200.0); // Create the "hair" density
    
    // ALPHA TEST: If this pixel isn't hair, discard it. 
    // This creates sharp edges instead of blurry transparency.
    if (uLayer > 0.0 && n < (uLayer * 0.05)) discard;
    
    float shading = 1.0 - (uLayer * 0.03); // Darken inner layers for depth
    
    // Gradient Color: Darker at the bottom, Lighter at the top
    float brightness = 0.5 + 0.5 * vUv.y;
    vec3 finalColor = uColor * shading * brightness;

    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
)

extend({ FurMaterial })

export { FurMaterial }
