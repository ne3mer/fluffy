import React, { useRef, useMemo } from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './FurMaterial' // Ensures the primitive <furMaterial> is registered

function FurLayer({ index, total }) {
  const matRef = useRef()
  
  useFrame((state) => {
    if (matRef.current) {
      // Animate the 'wind' time
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
        uColor={new THREE.Color('#ff69b4')}
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

  const layers = useMemo(() => new Array(20).fill(0), [])
  
  // Eye Tracking Ref
  const eyesRef = useRef()
  const vec = new THREE.Vector3()

  useFrame((state) => {
      if (eyesRef.current) {
         // Convert 2D mouse to 3D position at a fixed depth to look at
         vec.set(state.mouse.x * 10, state.mouse.y * 10, 5)
         eyesRef.current.lookAt(vec)
      }
  })

  return (
    <group ref={ref}>
      <mesh onClick={(e) => {
        e.stopPropagation()
        // Push the ball away in a random direction
        const x = (Math.random() - 0.5) * 10
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 10
        api.velocity.set(x, y, z)
        api.angularVelocity.set(x, y, z)
      }}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {/* THE EYES: Relative to the sphere center */}
      {/* We wrap them in a group that rotates to look at the mouse */}
      <group ref={eyesRef} position={[0, 0, 0]}> 
        <group position={[0.4, 0.4, 0.85]}>
            {/* Right Eye */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
        
        <group position={[-0.4, 0.4, 0.85]}>
            {/* Left Eye */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
      </group>

      {layers.map((_, i) => (
        <FurLayer key={i} index={i} total={20} />
      ))}
    </group>
  )
}
