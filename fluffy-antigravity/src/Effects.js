import React from 'react'
import { EffectComposer, Bloom, Glitch, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { GlitchMode, BlendFunction } from 'postprocessing'

export function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.2} 
        intensity={1.5} 
        levels={9} 
        mipmapBlur 
      />
      <ChromaticAberration 
         blendFunction={BlendFunction.NORMAL} // Use NORMAL to see the splitting clearly
         offset={[0.005, 0.005]} 
      />
      <Glitch 
        delay={[1.5, 3.5]} // Wait time between glitches
        duration={[0.6, 1.0]} // Duration of the glitch
        strength={[0.3, 1.0]} // Glitch strength
        mode={GlitchMode.SPORADIC} 
        ratio={0.85} 
      />
      <Noise opacity={0.05} />
    </EffectComposer>
  )
}
