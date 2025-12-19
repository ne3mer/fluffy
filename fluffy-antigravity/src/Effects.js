import React from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.4} 
        intensity={1.0} 
        levels={9} 
        mipmapBlur 
      />
    </EffectComposer>
  )
}
