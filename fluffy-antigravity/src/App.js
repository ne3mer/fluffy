import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Experience } from './Experience'
import { Effects } from './Effects'
import './index.css'

export default function App() {
  return (
    <>
      <Canvas 
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
      >
        {/* Physics still needed for the creature internals, although gravity is 0 */}
        <Physics gravity={[0, 0, 0]}>
          <Suspense fallback={null}>
             <Experience />
          </Suspense>
        </Physics>
        
        <Effects />
      </Canvas>
      {/* No Overlay needed, ScrollControls handles HTML */}
    </>
  )
}
