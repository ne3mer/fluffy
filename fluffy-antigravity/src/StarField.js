import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A reusable Warp Field component
export function StarField({ count = 2000 }) {
  const mesh = useRef()
  
  // Create randomized initial positions
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      temp.push({ x, y, z, originalZ: z })
    }
    return temp
  }, [count])

  useFrame((state) => {
    // "Warp" logic: Move particles towards camera (positive Z) based on time
    // We can modulate speed here. For now, constant slow drift + burst logic integration later.
    const time = state.clock.getElapsedTime()
    const speed = 0.5 

    particles.forEach((particle, i) => {
        // Simple endless scrolling stars
        let z = particle.z + time * 5 * speed 
        z = ((z + 50) % 100) - 50 // Wrap around between -50 and 50

        dummy.position.set(particle.x, particle.y, z)
        
        // Scale/Stretch based on "speed" (simulated for now)
        dummy.scale.z = 1 + speed * 2
        dummy.scale.x = dummy.scale.y = 0.5
        
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  )
}
