import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 1. LAPTOP
export function Laptop({ active }) {
    const group = useRef()
    const screen = useRef()
    const scale = active ? 0.3 : 0
    
    useFrame((state) => {
        if (!active) return
        // Open animation
        const t = state.clock.elapsedTime
        // Lerp open
        screen.current.rotation.x = THREE.MathUtils.lerp(screen.current.rotation.x, -1.8, 0.1) // Open past 90 degrees
    })

    return (
        <group ref={group} scale={scale} position={[0, -0.2, 0.8]}>
            <group rotation={[0.4, 0, 0]}> {/* Tilt whole laptop up for viewing */}
                 {/* Base */}
                <mesh position={[0, -0.02, 0]}>
                    <boxGeometry args={[1.2, 0.05, 0.8]} />
                    <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Screen Group (Pivot at bottom) */}
                <group ref={screen} position={[0, 0, -0.4]} rotation={[-0.1, 0, 0]}> {/* Start closed */}
                    <mesh position={[0, 0.4, 0]}> {/* Offset center to pivot */}
                        <boxGeometry args={[1.2, 0.8, 0.05]} />
                        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Glowing Screen Face */}
                    <mesh position={[0, 0.4, 0.03]}> 
                        <planeGeometry args={[1.1, 0.7]} />
                        <meshBasicMaterial color="#00ffff" />
                    </mesh>
                    {/* Apple Logo (Subtle dot) */}
                     <mesh position={[0, 0.4, -0.03]} rotation={[0, Math.PI, 0]}> 
                        <circleGeometry args={[0.08, 32]} />
                        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            </group>
        </group>
    )
}

// 2. HARD HAT
export function HardHat({ active }) {
    const scale = active ? 1 : 0
    return (
        <group scale={scale} position={[0, 0.8, 0]} rotation={[-0.2, 0, 0]}>
            {/* Dome */}
            <mesh>
                 <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                 <meshStandardMaterial color="#fbbf24" roughness={0.2} />
            </mesh>
            {/* Rim */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.6, 0.05, 16, 50]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.2} />
            </mesh>
             {/* Peak */}
             <mesh position={[0, 0, 0.6]} rotation={[-0.2, 0, 0]}>
                 <boxGeometry args={[0.4, 0.05, 0.4]} />
                 <meshStandardMaterial color="#fbbf24" roughness={0.2} />
             </mesh>
        </group>
    )
}

// 3. MAGNIFYING GLASS
export function MagnifyingGlass({ active }) {
    const scale = active ? 1 : 0
    // Float in front of RIGHT eye
    return (
        <group scale={scale} position={[0.4, 0.2, 1.2]} rotation={[0, 0, -0.4]}>
            {/* Rim */}
            <mesh>
                <torusGeometry args={[0.35, 0.04, 16, 50]} />
                <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.1} /> {/* Gold */}
            </mesh>
            {/* Internal Glass (Cylinder for volume or circle) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.34, 0.34, 0.02, 32]} />
                <meshPhysicalMaterial 
                    transmission={1} 
                    thickness={0.5} 
                    roughness={0} 
                    ior={1.5} 
                    color="white" 
                    transparent
                />
            </mesh>
            {/* Handle */}
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
                <meshStandardMaterial color="#5c3a21" /> {/* Wood */}
            </mesh>
        </group>
    )
}

// 4. HALO
export function Halo({ active }) {
    const scale = active ? 1 : 0
    const ref = useRef()
    
    useFrame((state) => {
        if (ref.current && active) {
            ref.current.rotation.z += 0.02
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })

    return (
        <group ref={ref} scale={scale} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
                 <torusGeometry args={[0.8, 0.05, 16, 100]} />
                 <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
            </mesh>
        </group>
    )
}
