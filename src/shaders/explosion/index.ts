import * as THREE from "three"
import fragment from "./fragment.glsl?raw"
import vertex from "./vertex.glsl?raw"

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
        u_intensityMin: { value: 0.25 },
        u_intensityMax: { value: 0.5 },
        u_alphaMin: { value: 0.2 },
        u_alphaMax: { value: 0.3 },
        u_c1: { value: new THREE.Color(0x000000) },
        u_c2: { value: new THREE.Color(0xff0000) },
        u_c3: { value: new THREE.Color(0xff8800) },
        u_c4: { value: new THREE.Color(0xffff88) },
      },
    })
  }
