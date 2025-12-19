import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment, OrbitControls } from '@react-three/drei'
import { FluffyCreature } from './FluffyCreature'
import { Overlay } from './Overlay'
import { Effects } from './Effects'
import * as THREE from 'three'

function FloatingDebris({ count = 100 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const mx = (Math.random() - 0.5) * 2
      const my = (Math.random() - 0.5) * 2
      const mz = (Math.random() - 0.5) * 2
      temp.push({ t, factor, speed, mx, my, mz })
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, mx, my, mz } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      dummy.position.set(
        (particle.mx * t) * a + mx * factor * a + Math.sin(t*10)*2,
        (particle.my * t) * b + my * factor * b + Math.cos(t*10)*2, 
        (particle.mz * t) * b + mz * factor * b
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <tetrahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#606060" />
    </instancedMesh>
  )
}

export default function App() {
  return (
    <>
      <Canvas 
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050505' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {/* Dynamic Colored Lights */}
        <pointLight position={[-10, 0, -10]} color="red" intensity={2} />
        <pointLight position={[0, 10, 0]} color="blue" intensity={2} />

        <Physics gravity={[0, 0, 0]}>
          <Suspense fallback={null}>
            <FluffyCreature position={[0, 0, 0]} />
            <FluffyCreature position={[2, 2, -2]} />
          </Suspense>
        </Physics>
        
        <FloatingDebris />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <Effects />
      </Canvas>
      <Overlay />
    </>
  )
}
