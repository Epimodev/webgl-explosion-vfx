import * as THREE from "three"
import { Timeline } from "../animation"
import * as Easing from "../animation/easing"
import { lerp } from "../math"
import {
  fireSmokeFragment,
  fireSmokeVertex,
  sparklesFragment,
  sparklesVertex,
} from "./shaders.glslx"

export type Explosion = {
  light: THREE.PointLight
  fireSmokeMaterial: THREE.RawShaderMaterial
  fireSmoke: THREE.Group
  sparkles: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  timeline: Timeline
}

// semi icosphere points exported from Blender
const icospherePoints = (): THREE.Vector3[] => {
  return [
    new THREE.Vector3(0.276388, 0.44722, 0.850649),
    new THREE.Vector3(-0.723607, 0.44722, 0.525725),
    new THREE.Vector3(-0.723607, 0.44722, -0.525725),
    new THREE.Vector3(0.276388, 0.44722, -0.850649),
    new THREE.Vector3(0.894426, 0.447216, 0.0),
    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(0.951058, 0.0, 0.309013),
    new THREE.Vector3(0.951058, 0.0, -0.309013),
    new THREE.Vector3(0.0, 0.0, 1.0),
    new THREE.Vector3(0.587786, 0.0, 0.809017),
    new THREE.Vector3(-0.951058, 0.0, 0.309013),
    new THREE.Vector3(-0.587786, 0.0, 0.809017),
    new THREE.Vector3(-0.587786, 0.0, -0.809017),
    new THREE.Vector3(-0.951058, 0.0, -0.309013),
    new THREE.Vector3(0.587786, 0.0, -0.809017),
    new THREE.Vector3(0.0, 0.0, -1.0),
    new THREE.Vector3(0.688189, 0.525736, 0.499997),
    new THREE.Vector3(-0.262869, 0.525738, 0.809012),
    new THREE.Vector3(-0.850648, 0.525736, 0.0),
    new THREE.Vector3(-0.262869, 0.525738, -0.809012),
    new THREE.Vector3(0.688189, 0.525736, -0.499997),
    new THREE.Vector3(0.162456, 0.850654, 0.499995),
    new THREE.Vector3(0.52573, 0.850652, 0.0),
    new THREE.Vector3(-0.425323, 0.850654, 0.309011),
    new THREE.Vector3(-0.425323, 0.850654, -0.309011),
    new THREE.Vector3(0.162456, 0.850654, -0.499995),
  ]
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

const createFireSmokeParticules = (
  material: THREE.RawShaderMaterial,
): THREE.Group => {
  const group = new THREE.Group()
  const points = icospherePoints()
  const geometry = new THREE.PlaneGeometry(1, 1)

  for (const point of points) {
    const mesh = new THREE.Mesh(geometry, material)
    const scale = lerp(0.5, 1, Math.random())
    mesh.position.set(point.x, point.y, point.z)
    mesh.scale.set(scale, scale, scale)
    group.add(mesh)
  }

  return group
}

export const createExplosion = (): Explosion => {
  const fireSmokeMaterial = new THREE.RawShaderMaterial({
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
  const fireSmoke = createFireSmokeParticules(fireSmokeMaterial)
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
      initialValue: 0.1,
      keyframes: [
        {
          duration: 1000,
          value: 1.8,
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
          duration: 700,
          value: 0.3,
          easing: Easing.easeOutQuad,
        },
        {
          duration: 6000,
          value: 2,
          easing: Easing.easeInQuad,
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
    fireSmokeMaterial,
    fireSmoke,
    sparkles,
    timeline,
  }
}
