import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A Tunnel of Rings guiding the camera
export function TunnelRings({ count = 30, length = 100 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  // Placement: Along negative Z
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const z = -(i / count) * length // 0 to -100
      const scale = 1 + Math.random() * 0.5
      temp.push({ z, scale, speed: (Math.random() - 0.5) * 0.01 })
    }
    return temp
  }, [count, length])

  useFrame((state) => {
    particles.forEach((p, i) => {
        // Slow rotation for life
        const time = state.clock.elapsedTime
        dummy.position.set(0, 0, p.z)
        dummy.rotation.z = time * 0.2 + i * 0.5 // Spiral spin
        dummy.rotation.x = Math.sin(time * 0.5 + i) * 0.1 // Subtle wobble
        dummy.scale.set(p.scale, p.scale, p.scale)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      {/* Large thin ring */}
      <torusGeometry args={[8, 0.05, 16, 100]} /> 
      <meshStandardMaterial color="#444" emissive="#222" transparent opacity={0.3} wireframe={false} />
    </instancedMesh>
  )
}
