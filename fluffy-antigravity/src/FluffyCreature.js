import React, { useRef, useMemo } from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './FurMaterial' // Ensures the primitive <furMaterial> is registered

// Helper component to pass props to FurMaterial
function FurLayer({ index, total }) {
  const matRef = useRef()
  
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime
    }
  })


  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <furMaterial
        ref={matRef}
        uLayer={index}
        uTotalLayers={total}
        uColorTop={new THREE.Color('#a855f7')} // Purple Top
        uColorBottom={new THREE.Color('#db2777')} // Pink Bottom
        uTime={0}
      />
    </mesh>
  )
}

export function FluffyCreature({ position = [0, 0, 0] }) {
  // Setup physics body
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [1],
    linearDamping: 0.1,
    angularDamping: 0.1,
  }))

  const layers = useMemo(() => new Array(12).fill(0), [])
  
  // Eye Tracking Ref
  const eyesRef = useRef()
  const vec = new THREE.Vector3()

  useFrame((state) => {
      if (eyesRef.current) {
         vec.set(state.mouse.x * 10, state.mouse.y * 10, 5)
         eyesRef.current.lookAt(vec)
      }
  })

  return (
    <group ref={ref}>
      <mesh onClick={(e) => {
        e.stopPropagation()
        // Push away
        const x = (Math.random() - 0.5) * 10
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 10
        api.velocity.set(x, y, z)
        api.angularVelocity.set(x, y, z)
      }}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#db2777" /> 
      </mesh>
      
      {/* THE EYES: Large Glossy Black Beads */}
      <group ref={eyesRef} position={[0, 0, 0]}> 
        <group position={[0.35, 0.2, 0.85]}>
            {/* Right Eye */}
            <mesh>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="black" roughness={0.1} metalness={0.5} />
            </mesh>
            {/* Fake Reflection Dot */}
            <mesh position={[0.1, 0.1, 0.22]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
        
        <group position={[-0.35, 0.2, 0.85]}>
            {/* Left Eye */}
            <mesh>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="black" roughness={0.1} metalness={0.5} />
            </mesh>
            {/* Fake Reflection Dot */}
            <mesh position={[0.1, 0.1, 0.22]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
      </group>

      {layers.map((_, i) => (
        <FurLayer key={i} index={i} total={12} />
      ))}
    </group>
  )
}
