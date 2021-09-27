import * as THREE from "three"
import { fragment, vertex } from "./shaders.glslx"

// Create semi icosphere exported from Blender
class SemiIcosphere extends THREE.BufferGeometry {
  constructor() {
    super()

    // prettier-ignore
    const positions = [
      0.276388, 0.44722, 0.850649,
      -0.723607, 0.44722, 0.525725,
      -0.723607, 0.44722, -0.525725,
      0.276388, 0.44722, -0.850649,
      0.894426, 0.447216, 0.0,
      0.0, 1.0, 0.0,
      0.951058, 0.0, 0.309013,
      0.951058, 0.0, -0.309013,
      0.0, 0.0, 1.0,
      0.587786, 0.0, 0.809017,
      -0.951058, 0.0, 0.309013,
      -0.587786, 0.0, 0.809017,
      -0.587786, 0.0, -0.809017,
      -0.951058, 0.0, -0.309013,
      0.587786, 0.0, -0.809017,
      0.0, 0.0, -1.0,
      0.688189, 0.525736, 0.499997,
      -0.262869, 0.525738, 0.809012,
      -0.850648, 0.525736, 0.0,
      -0.262869, 0.525738, -0.809012,
      0.688189, 0.525736, -0.499997,
      0.162456, 0.850654, 0.499995,
      0.52573, 0.850652, 0.0,
      -0.425323, 0.850654, 0.309011,
      -0.425323, 0.850654, -0.309011,
      0.162456, 0.850654, -0.499995,
    ]

    const radiusCoef: number[] = []
    for (let i = 0, l = positions.length; i < l; i += 3) {
      radiusCoef.push(Math.random())
    }

    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    )
    this.setAttribute(
      "radiusCoef",
      new THREE.Float32BufferAttribute(radiusCoef, 1),
    )
  }
}

export const createExplosion = (): THREE.Points<
  THREE.BufferGeometry,
  THREE.RawShaderMaterial
> => {
  const geometry = new SemiIcosphere()
  const material = new THREE.RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      u_distance: { value: 1.0 },
      u_randomness: { value: 0.5 },
      u_time: { value: 0 },
      u_speed: { value: 2 },
      u_noiseScale: { value: 4 },
      u_intensityOffset: { value: 0.22 },
      u_intensityAmplitude: { value: 0.25 },
      u_alphaOffset: { value: 0.16 },
      u_alphaAmplitude: { value: 0.1 },
      u_c1: { value: new THREE.Color(0x000000) },
      u_c2: { value: new THREE.Color(0xff0000) },
      u_c3: { value: new THREE.Color(0xff8800) },
      u_c4: { value: new THREE.Color(0xffff88) },
    },
  })

  const points = new THREE.Points(geometry, material)
  points.scale.y = 0.7

  return points
}
