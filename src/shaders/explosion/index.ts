import * as THREE from "three"
// import fragment from "./fragment.glsl?raw"
// import vertex from "./vertex.glsl?raw"
import { fragment, vertex } from "./shaders.glslx"

type ExplosionMaterialParams = {} // eslint-disable-line

export const explosionMaterial =
  // eslint-disable-next-line
  ({}: ExplosionMaterialParams): THREE.RawShaderMaterial => {
    return new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_speed: { value: 2 },
        u_intensityOffset: { value: 0.25 },
        u_intensityAmplitude: { value: 0.25 },
        u_alphaOffset: { value: 0.2 },
        u_alphaAmplitude: { value: 0.1 },
        u_c1: { value: new THREE.Color(0x000000) },
        u_c2: { value: new THREE.Color(0xff0000) },
        u_c3: { value: new THREE.Color(0xff8800) },
        u_c4: { value: new THREE.Color(0xffff88) },
      },
    })
  }
