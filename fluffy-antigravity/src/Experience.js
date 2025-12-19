import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Text, Float, Html } from '@react-three/drei'
import { FluffyCreature } from './FluffyCreature'
import { StarField } from './StarField'
import { TunnelRings } from './TunnelRings'
import { cvData } from './cvData'
import * as THREE from 'three'

// 3D Title Component
const SectionTitle = ({ position, text, color }) => {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
                // Using a standard system font fallback isn't easy in 3D. 
                // Let's use a standard google font URL for the specialized font.
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
                position={position}
                fontSize={1.5}
                color={color}
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
                textAlign="center"
                lineHeight={1}
            >
                {text}
                <meshStandardMaterial emissive={color} emissiveIntensity={0.5} color={color} />
            </Text>
        </Float>
    )
}

// Holographic Data Panel (3D HTML) with Impact Animation
const HolographicPanel = ({ position, rotation = [0, 0, 0], data, align = 'left', active }) => {
    // We can use simple CSS classes or inline styles for the "Pop"
    // But since it's Drei HTML, let's use a scale transition on the container
    const scale = active ? 1 : 0
    const opacity = active ? 1 : 0

    return (
    <group position={position} rotation={rotation} scale={scale} style={{ transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}> 
        {/* We use a group scale for the 3D popping effect if possible, but HTML transform doesn't always inherit.
            Let's pass style to HTML div instead.
        */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <Html transform occlude distanceFactor={10} style={{
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: `scale(${scale})`,
                opacity: opacity,
                background: 'rgba(10, 10, 16, 0.85)',
                border: `1px solid ${data.color}`,
                padding: '20px',
                borderRadius: '10px',
                color: '#fff',
                width: '300px',
                fontFamily: "'Inter', sans-serif",
                boxShadow: `0 0 20px ${data.color}40`, // Soft glow
                backdropFilter: 'blur(5px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: `1px solid ${data.color}50`, paddingBottom: '5px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: data.color, textTransform: 'uppercase', letterSpacing: '1px' }}>HUD // {data.title}</h3>
                    <div style={{ width: '10px', height: '10px', background: data.color, borderRadius: '50%' }}></div>
                </div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.8 }}>{data.subtitle}</h4>
                <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', lineHeight: '1.4', opacity: 0.9 }}>{data.text}</p>
                
                {data.details && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px' }}>
                        {data.details.map((d, i) => (
                             <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.6 }}>{d.label}</span>
                                <span style={{ fontWeight: 'bold' }}>{d.value}</span>
                             </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                     {data.tags && data.tags.map(t => (
                        <span key={t} style={{ fontSize: '0.6rem', padding: '2px 6px', border: `1px solid ${data.color}60`, color: data.color, borderRadius: '2px' }}>
                            {t}
                        </span>
                     ))}
                </div>
            </Html>
        </Float>
    </group>
    )
}

const SceneContent = () => {
  const scroll = useScroll()
  const creatureRef = useRef()
  const lightRef = useRef()
  // Trigger state for panels
  const [activeStep, setActiveStep] = React.useState(0)
  
  // Colors for each section
  const colors = [
    cvData.intro.color,
    cvData.foundation.color,
    cvData.skills.color,
    cvData.research.color,
    cvData.future.color
  ]

  useFrame((state) => {
    // 1. Camera Movement
    // Intro: 5, Found: -15, Skills: -35, Research: -55, Vision: -75
    // Total distance = 80 units
    const deepZ = 5 - scroll.offset * 80 
    
    // Smooth Swirl
    const targetX = Math.sin(scroll.offset * Math.PI * 4) * 3
    const targetY = Math.cos(scroll.offset * Math.PI * 4) * 3

    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, deepZ), 0.1)
    state.camera.lookAt(0, 0, deepZ - 10)

    // 2. Creature Movement
    if (creatureRef.current) {
        creatureRef.current.position.lerp(new THREE.Vector3(targetX * 0.8, targetY * 0.8 - 1, deepZ - 5), 0.1)
        
        // Tilt creature into the turn
        creatureRef.current.rotation.z = -targetX * 0.1 
        // Spin faster when moving between sections!
        creatureRef.current.rotation.x += 0.05 + scroll.delta * 10
    }

    // 3. Color Interpolation & Step Calculation
    // We have 5 steps: 0, 1, 2, 3, 4
    // offset 0 -> 1 maps to steps
    const n = scroll.offset * (colors.length - 1)
    const index = Math.floor(n + 0.5) // Round to nearest step
    if (index !== activeStep) setActiveStep(index)

    const baseIndex = Math.floor(n)
    const factor = n - baseIndex
    
    // Safety
    const c1 = colors[baseIndex] || '#fff'
    const c2 = colors[baseIndex + 1] || c1
    const colorC = new THREE.Color(c1).lerp(new THREE.Color(c2), factor)
    
    if (lightRef.current) lightRef.current.color = colorC
  })

  return (
    <>
      <group ref={creatureRef}>
         <FluffyCreature activeSection={activeStep} />
      </group>
      
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} distance={20} />
      
      <StarField count={1000} />
      <TunnelRings count={20} length={100} />
      
      {/* 3D TEXT & HUD STOPS */}
      {/* Intro (Index 0) */}
      <SectionTitle position={[0, 2, -5]} text="NIMA AFSHARFAR" color={cvData.intro.color} />
      <HolographicPanel position={[3.5, 0, -5]} rotation={[0, -0.2, 0]} data={cvData.intro} active={activeStep === 0} />
      
      {/* Foundation (Index 1) */}
      <SectionTitle position={[-3, 2, -25]} text="ENGINEER" color={cvData.foundation.color} />
      <HolographicPanel position={[3, 0, -25]} rotation={[0, -0.3, 0]} data={cvData.foundation} active={activeStep === 1} />
      
      {/* Skills (Index 2) */}
      <SectionTitle position={[3, -2, -45]} text="BUILDER" color={cvData.skills.color} />
      <HolographicPanel position={[-3, 0, -45]} rotation={[0, 0.3, 0]} data={cvData.skills} active={activeStep === 2} />
      
      {/* Research (Index 3) */}
      <SectionTitle position={[0, 3, -65]} text="RESEARCHER" color={cvData.research.color} />
      <HolographicPanel position={[0, -2, -65]} rotation={[-0.2, 0, 0]} data={cvData.research} active={activeStep === 3} />
      
      {/* Vision (Index 4) */}
      <SectionTitle position={[0, 0, -85]} text="VISIONARY" color={cvData.future.color} />
      <HolographicPanel position={[0, -2.5, -85]} rotation={[-0.2, 0, 0]} data={cvData.future} active={activeStep === 4} />

    </>
  )
}

export function Experience() {
  return (
    <ScrollControls pages={5} damping={0.2}>
        <SceneContent />
        {/* No 2D scroll content anymore - pure 3D experience */}
    </ScrollControls>
  )
}
