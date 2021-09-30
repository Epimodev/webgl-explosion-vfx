import * as THREE from "three"
import { lerp } from "../math"
import {
  fireCloudfragment,
  fireCloudVertex,
  sparklesFragment,
  sparklesVertex,
} from "./shaders.glslx"

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
    const sizeCoef: number[] = []
    for (let i = 0, l = positions.length; i < l; i += 3) {
      radiusCoef.push(Math.random())
      sizeCoef.push(lerp(0.5, 1, Math.random()))
    }

    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    )
    this.setAttribute(
      "radiusCoef",
      new THREE.Float32BufferAttribute(radiusCoef, 1),
    )
    this.setAttribute("sizeCoef", new THREE.Float32BufferAttribute(sizeCoef, 1))
  }
}

class RandomSparkles extends THREE.BufferGeometry {
  constructor(nbSparkles: number) {
    super()

    const positions: number[] = []
    for (let i = 0; i < nbSparkles; i += 1) {
      const radius = lerp(0.5, 1, Math.random())
      const angle = lerp(0, 2 * Math.PI, Math.random())
      const x = radius * Math.cos(angle)
      const y = lerp(0.5, 1.5, Math.random()) // used for sparkles max height
      const z = -radius * Math.sin(angle)
      positions.push(x, y, z)
    }

    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    )
  }
}

export const createExplosion = (): {
  fireSmoke: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  sparkles: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
} => {
  const fireSmokeGeometry = new SemiIcosphere()
  const fireSmokeMaterial = new THREE.RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: fireCloudVertex,
    fragmentShader: fireCloudfragment,
    uniforms: {
      u_radius: { value: 1.0 },
      u_particuleScale: { value: 1.0 },
      u_time: { value: 0 },
      u_height: { value: 0.0 },
      u_speed: { value: 2 },
      u_noiseScale: { value: 4 },
      u_circleOffset: { value: 0.7 },
      u_circleAmplitude: { value: 0.2 },
      u_intensityOffset: { value: 0.39 },
      u_intensityAmplitude: { value: 0.3 },
      u_alphaOffset: { value: 0.15 },
      u_alphaAmplitude: { value: 0.1 },
      u_c1: { value: new THREE.Color(0x000000) },
      u_c2: { value: new THREE.Color(0xff0000) },
      u_c3: { value: new THREE.Color(0xff8800) },
      u_c4: { value: new THREE.Color(0xffff88) },
    },
  })

  const sparklesGeometry = new RandomSparkles(15)
  const sparklesMaterial = new THREE.RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: sparklesVertex,
    fragmentShader: sparklesFragment,
    uniforms: {
      u_sparkleHeight: { value: 0 },
      u_sparkleScale: { value: 0.5 },
      u_sparkleRadius: { value: 1 },
      u_sparkleIntensity: { value: 1 },
      u_c1: { value: new THREE.Color(0xff8800) },
      u_c2: { value: new THREE.Color(0xffff88) },
    },
  })

  return {
    fireSmoke: new THREE.Points(fireSmokeGeometry, fireSmokeMaterial),
    sparkles: new THREE.Points(sparklesGeometry, sparklesMaterial),
  }
}
