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
  uniform float uTime;
  uniform vec3 uColor;

  // Simple pseudo-random function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Cosine based palette, 4 vec3 params
  vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
  {
      return a + b*cos( 6.28318*(c*t+d) );
  }

  void main() {
    float n = hash(vUv * 200.0); // Create the "hair" density
    if (uLayer > 0.0 && n < (uLayer * 0.05)) discard;
    
    float shading = 1.0 - (uLayer * 0.03); // Darken inner layers for depth
    
    // Rainbow Logic
    vec3 color = palette(
        uTime * 0.1 + vUv.x, 
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 1.0),
        vec3(0.00, 0.33, 0.67)
    );
    
    gl_FragColor = vec4(color * shading, 1.0);
  }
  `
)

extend({ FurMaterial })

export { FurMaterial }
