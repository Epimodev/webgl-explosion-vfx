import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { Timeline } from "../animation"
import * as Easing from "../animation/easing"
import { lerp } from "../math"
import {
  fireSmokeFragment,
  fireSmokeVertex,
  sparklesFragment,
  sparklesVertex,
} from "./shaders.glslx"
import streaksPlaneData from "./streaks-plane.obj?raw"

export type Explosion = {
  light: THREE.PointLight
  fireSmoke: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>
  sparkles: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  streaks: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>
  timeline: Timeline
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

const createStreaksGeometry = (): THREE.BufferGeometry => {
  const loader = new OBJLoader()
  const parsed = loader.parse(streaksPlaneData)
  const mesh = parsed.children[0] as THREE.Mesh

  return mesh.geometry
}

export const createExplosion = (): Explosion => {
  const fireSmokeGeometry = new THREE.PlaneGeometry(1, 1)
  const fireSmokeMaterial = new THREE.RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: fireSmokeVertex,
    fragmentShader: fireSmokeFragment,
    uniforms: {
      u_time: { value: 0 },
      u_noiseSpeed: { value: 2 },
      u_smokeScale: { value: 1.0 },
      u_height: { value: 0.0 },
      u_noiseScale: { value: 4 },
      u_circleLimit: { value: 0.7 },
      u_circleSmoothness: { value: 0.2 },
      u_intensity: { value: 0.39 },
      u_intensitySmoothness: { value: 0.3 },
      u_transparency: { value: 0.15 },
      u_transparencySmoothness: { value: 0.1 },
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

  const streaksGeometry = createStreaksGeometry()
  const streaksMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

  const light = new THREE.PointLight(0xffffff)
  light.position.set(0, 0.2, 0)
  light.intensity = 0
  const fireSmoke = new THREE.Mesh(fireSmokeGeometry, fireSmokeMaterial)
  const sparkles = new THREE.Points(sparklesGeometry, sparklesMaterial)
  const streaks = new THREE.Mesh(streaksGeometry, streaksMaterial)

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
      target: fireSmokeMaterial.uniforms.u_circleLimit,
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
      target: fireSmokeMaterial.uniforms.u_smokeScale,
      key: "value",
      initialValue: 0.1,
      keyframes: [
        {
          duration: 1000,
          value: 2.5,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: fireSmokeMaterial.uniforms.u_circleSmoothness,
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
          duration: 500,
          value: 0.8,
          easing: Easing.easeOutQuad,
        },
        {
          duration: 4000,
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
      target: fireSmokeMaterial.uniforms.u_transparency,
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
      target: fireSmokeMaterial.uniforms.u_transparencySmoothness,
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
    streaks,
    timeline,
  }
}
