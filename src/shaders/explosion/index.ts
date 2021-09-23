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
        u_time: {
          value: 0,
        },
      },
    })
  }
