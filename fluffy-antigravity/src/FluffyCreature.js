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

export function FluffyCreature({ position = [0, 0, 0], activeSection = 0 }) {
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
  // Internal animation state ref
  const animRef = useRef({ eyeScale: 1 })

  useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Default Animations
      let eyeTargetScale = 1
      
      // 1. REACTION LOGIC
      if (ref.current) {
          // Reset basic transforms overridden by physics? 
          // Physics coordinates are absolute. We can't easily animate position directly without fighting physics.
          // BUT visual mesh is inside ref? No, ref IS the physics body.
          // TRICK: We can apply impulses or modify the EYES group for purely visual effects.
          
          switch(activeSection) {
              case 0: // INTRO: Happy Bounce
                 // We can't bounce physics body easily without api.velocity. 
                 // Let's rely on the eye/body inner group if we had one.
                 // Actually, we can use the EYES for expression.
                 eyesRef.current.position.y = Math.sin(time * 15) * 0.1 // Eyes bounce on face
                 break;
                 
              case 1: // ENGINEER: Glitch / Twitch
                 if (Math.random() > 0.9) {
                     eyesRef.current.position.x = (Math.random() - 0.5) * 0.2
                 } else {
                     eyesRef.current.position.x = 0 // Reset
                 }
                 break;
                 
              case 2: // BUILDER: Headbang
                 eyesRef.current.rotation.x = Math.sin(time * 20) * 0.5
                 break;
                 
              case 3: // RESEARCHER: Detective Mode
                 eyeTargetScale = 2.0 // Big eyes
                 break;
                 
              case 4: // VISIONARY: Ascension / Zen
                 eyesRef.current.position.y = Math.sin(time * 2) * 0.05 // Slow breathe
                 eyesRef.current.scale.setScalar(0.8) // Zen squint
                 break;
                 
              default:
                 break;
          }
      }

      // Smooth Eye Scaling
      if (eyesRef.current) {
         // Lerp current scale to target
         animRef.current.eyeScale = THREE.MathUtils.lerp(animRef.current.eyeScale, eyeTargetScale, 0.1)
         const s = animRef.current.eyeScale
         // Apply to both eyes individually or the group? 
         // Applying to group scales distance too. Better to apply to meshes if possible, but group is easier for "Cartoon" effect.
         // Let's scale the eyes (children)
         eyesRef.current.children[0].scale.setScalar(s) // Right Eye Group
         eyesRef.current.children[1].scale.setScalar(s) // Left Eye Group

         // LookAt Logic (Overrides rotation, so Headbang might fight this if not careful. 
         // Headbang applied to eyesRef.rotation.x. lookAt changes rotation.
         // We should put Headbang in a parent or offset.)
         
         // Standard LookAt
         vec.set(state.mouse.x * 10, state.mouse.y * 10, 5)
         eyesRef.current.lookAt(vec)
         
         // Add Headbang AFTER lookAt
         if (activeSection === 2) {
             eyesRef.current.rotation.x += Math.sin(time * 20) * 0.5
         }
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
