import * as THREE from "three"
import { Timeline } from "../animation"
import * as Easing from "../animation/easing"
import { lerp } from "../math"
import {
  fireCloudfragment,
  fireCloudVertex,
  fireSmokeFragment,
  fireSmokeVertex,
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

export const fireSmokeMaterial = (): THREE.RawShaderMaterial => {
  return new THREE.RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: fireSmokeVertex,
    fragmentShader: fireSmokeFragment,
    uniforms: {
      u_time: { value: 0 },
      u_speed: { value: 2 },
      u_radius: { value: 1.0 },
      u_particuleScale: { value: 1.0 },
      u_height: { value: 0.0 },
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
}

export const fireSmokeParticule = (
  material: THREE.RawShaderMaterial,
  position: THREE.Vector3,
  scale: number,
): THREE.Mesh => {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  mesh.position.set(position.x, position.y, position.z)
  mesh.scale.set(scale, scale, 1)

  return mesh
}

export const createExplosion = (): {
  light: THREE.PointLight
  fireSmoke: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  sparkles: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  timeline: Timeline
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

  const light = new THREE.PointLight(0xffffff)
  light.position.set(0, 0.2, 0)
  light.intensity = 0
  const fireSmoke = new THREE.Points(fireSmokeGeometry, fireSmokeMaterial)
  const sparkles = new THREE.Points(sparklesGeometry, sparklesMaterial)

  const timeline = new Timeline([
    {
      target: light,
      key: "intensity",
      initialValue: 0,
      keyframes: [
        {
          duration: 50,
          value: 4,
          easing: Easing.easeInExpo,
        },
        {
          duration: 500,
          value: 0,
          easing: Easing.easeOutQuad,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_circleOffset,
      key: "value",
      initialValue: 1.0,
      keyframes: [
        {
          duration: 10,
          value: 0.7,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_radius,
      key: "value",
      initialValue: 0.1,
      keyframes: [
        {
          duration: 1000,
          value: 0.6,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_particuleScale,
      key: "value",
      initialValue: 0.3,
      keyframes: [
        {
          duration: 1000,
          value: 1.2,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_circleAmplitude,
      key: "value",
      initialValue: 0.15,
      keyframes: [
        {
          delay: 50,
          duration: 2000,
          value: 0.85,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_height,
      key: "value",
      initialValue: 0,
      keyframes: [
        {
          delay: 100,
          duration: 20000,
          value: 2,
          easing: Easing.easeOutQuad,
        },
      ],
    },
    {
      target: fireSmoke.scale,
      key: "y",
      initialValue: 1,
      keyframes: [
        {
          delay: 100,
          duration: 10000,
          value: 1.6,
          easing: Easing.easeOutQuad,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_alphaOffset,
      key: "value",
      initialValue: 0.15,
      keyframes: [
        {
          delay: 5000,
          duration: 5000,
          value: 0.3,
          easing: Easing.linear,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_alphaAmplitude,
      key: "value",
      initialValue: 0.1,
      keyframes: [
        {
          delay: 500,
          duration: 20000,
          value: 2,
          easing: Easing.easeOutQuad,
        },
      ],
    },
    {
      target: sparklesMaterial.uniforms.u_sparkleScale,
      key: "value",
      initialValue: 0,
      keyframes: [
        {
          duration: 50,
          value: 1,
          easing: Easing.linear,
        },
        {
          delay: 500,
          duration: 1500,
          value: 0,
          easing: Easing.linear,
        },
      ],
    },
    {
      target: sparklesMaterial.uniforms.u_sparkleHeight,
      key: "value",
      initialValue: 0,
      keyframes: [
        {
          delay: 0,
          duration: 500,
          value: 1.8,
          easing: Easing.easeOutQuad,
        },
        {
          duration: 1500,
          value: 1.1,
          easing: Easing.easeInQuad,
        },
      ],
    },
    {
      target: sparklesMaterial.uniforms.u_sparkleRadius,
      key: "value",
      initialValue: 0.5,
      keyframes: [
        {
          delay: 0,
          duration: 1500,
          value: 2,
          easing: Easing.easeOutExpo,
        },
      ],
    },
  ])

  return {
    light,
    fireSmoke,
    sparkles,
    timeline,
  }
}
