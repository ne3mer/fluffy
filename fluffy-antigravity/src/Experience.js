import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Scroll, Text, Float } from '@react-three/drei'
import { FluffyCreature } from './FluffyCreature'
import { StarField } from './StarField'
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

// Biome: Engineering Wireframes
const EngineeringBiome = () => (
    <group position={[0, 0, -18]}>
        <Float speed={1} rotationIntensity={1} floatIntensity={2}>
            <mesh position={[-4, 2, 0]} rotation={[0.5, 0.5, 0]}>
                <icosahedronGeometry args={[2, 0]} />
                <meshBasicMaterial color="#00ffff" wireframe />
            </mesh>
            <mesh position={[4, -2, -2]}>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial color="#00ffff" wireframe />
            </mesh>
        </Float>
    </group>
)

const SceneContent = () => {
  const scroll = useScroll()
  const creatureRef = useRef()
  const lightRef = useRef()
  
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
        creatureRef.current.rotation.x = scroll.offset * Math.PI * 2
    }

    // 3. Color Interpolation
    const n = scroll.offset * (colors.length - 1)
    const index = Math.floor(n)
    const factor = n - index
    const colorC = new THREE.Color(colors[index] || '#ffffff')
    const colorNext = new THREE.Color(colors[index + 1] || colors[index])
    if (colors[index] && colors[index + 1]) colorC.lerp(colorNext, factor)
    
    if (lightRef.current) lightRef.current.color = colorC
  })

  return (
    <>
      <group ref={creatureRef}>
         {/* Pass a fixed color for now as prop passing is complex with lerp here. 
             Ideally we update the creature prop or material directly. 
             Since we updated App.js to pass color, we rely on App.js state or simplified approach. 
             Actually, Experience handles animation loop. We should refactor FluffyCreature to accept a ref for color? 
             Or simpler: Just let the light color everything! 
             We'll pass 'white' to creature so it reflects the colored light perfectly. 
         */}
         <FluffyCreature color="white" />
      </group>
      
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} distance={20} />
      
      <StarField count={3000} />
      
      {/* 3D TEXT STOPS */}
      {/* Intro */}
      <SectionTitle position={[0, 0, -5]} text="NIMA AFSHARFAR" color={cvData.intro.color} />
      
      {/* Foundation (-15 camera position -> Text at -20) */}
      <EngineeringBiome />
      <SectionTitle position={[3, 2, -25]} text="ENGINEER" color={cvData.foundation.color} />
      
      {/* Skills (-35 -> Text at -40) */}
      <SectionTitle position={[-3, -2, -45]} text="BUILDER" color={cvData.skills.color} />
      
      {/* Research (-55 -> Text at -60) */}
      <SectionTitle position={[0, 3, -65]} text="RESEARCHER" color={cvData.research.color} />
      
      {/* Vision */}
      <SectionTitle position={[0, 0, -85]} text="VISIONARY" color={cvData.future.color} />
    </>
  )
}

// Minimal Detail Card
const DetailCard = ({ data }) => (
    <div style={{ 
        background: 'rgba(0,0,0,0.6)', 
        borderLeft: `2px solid ${data.color}`,
        padding: '20px', 
        backdropFilter: 'blur(5px)',
        maxWidth: '400px',
        marginTop: '200px' // Push down to let 3D Title shine
    }}>
        <p style={{ color: 'white', fontSize: '1rem', lineHeight: '1.5' }}>{data.text}</p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
            {data.tags && data.tags.map(t => (
                <span key={t} style={{ fontSize: '0.7em', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', color: data.color }}>{t}</span>
            ))}
        </div>
    </div>
)

const SectionLayout = ({ children, align = 'flex-start' }) => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: align, padding: '10vw' }}>
        {children}
    </div>
)

export function Experience() {
  return (
    <ScrollControls pages={5} damping={0.2}>
        <SceneContent />
        <Scroll html style={{ width: '100%' }}>
            {/* We only show Details details now. Titles are 3D */}
            <SectionLayout align="center">
                <div style={{ color: 'white', textAlign: 'center', marginTop: '60vh' }}>
                    <p style={{ opacity: 0.7 }}>SCROLL TO FLY</p>
                </div>
            </SectionLayout>
            
            <SectionLayout align="flex-end">
                <DetailCard data={cvData.foundation} />
            </SectionLayout>
            
            <SectionLayout align="flex-start">
                <DetailCard data={cvData.skills} />
            </SectionLayout>
            
            <SectionLayout align="center">
                <DetailCard data={cvData.research} />
            </SectionLayout>
            
            <SectionLayout align="center">
                <DetailCard data={cvData.future} />
            </SectionLayout>
        </Scroll>
    </ScrollControls>
  )
}
