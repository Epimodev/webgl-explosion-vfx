import * as THREE from "three"
import fragment from "./fragment.glsl?raw"
import vertex from "./vertex.glsl?raw"

type UvGridMaterialParams = {
  scale: number
  color1: THREE.Color
  color2: THREE.Color
}

export const uvGridMaterial = ({
  scale,
  color1,
  color2,
}: UvGridMaterialParams): THREE.RawShaderMaterial => {
  return new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    uniforms: {
      u_scale: {
        value: scale,
      },
      u_color1: {
        value: color1,
      },
      u_color2: {
        value: color2,
      },
    },
  })
}
