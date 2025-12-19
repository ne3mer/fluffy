import React from 'react'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.4} 
        intensity={1.0} 
        levels={9} 
        mipmapBlur 
      />
      <Noise opacity={0.02} />
    </EffectComposer>
  )
}
