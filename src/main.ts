import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Timeline } from "./animation"
import * as Easing from "./animation/easing"
import { createExplosion } from "./explosion"
import { explosionPane } from "./explosion/tweakpane"
import "./style.css"

const MAX_PIXEL_RATIO = 2

const main = () => {
  const scene = new THREE.Scene()

  // Setup camera
  const fov = 50 // degres
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 5
  camera.position.x = 0
  camera.position.y = 1
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // Create 1 explosion
  const explosion = createExplosion()
  scene.add(explosion)

  const explosionTimeline = new Timeline([
    {
      target: explosion.material.uniforms.u_circleOffset,
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
      target: explosion.material.uniforms.u_radius,
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
      target: explosion.material.uniforms.u_particuleScale,
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
      target: explosion.material.uniforms.u_circleAmplitude,
      key: "value",
      initialValue: 0.15,
      keyframes: [
        {
          delay: 50,
          duration: 1000,
          value: 0.85,
          easing: Easing.easeOutExpo,
        },
      ],
    },
    {
      target: explosion.material.uniforms.u_alphaOffset,
      key: "value",
      initialValue: 0.2,
      keyframes: [
        {
          delay: 200,
          duration: 1000,
          value: 0.1,
          easing: Easing.linear,
        },
      ],
    },
    {
      target: explosion.material.uniforms.u_alphaAmplitude,
      key: "value",
      initialValue: 0.2,
      keyframes: [
        {
          delay: 200,
          duration: 1000,
          value: 0.9,
          easing: Easing.linear,
        },
      ],
    },
  ])

  explosionTimeline.seek(800)

  // Setup pane config
  explosionPane(explosion.material, explosionTimeline)

  const clock = new THREE.Clock()
  clock.start()

  createPlayground({
    scene,
    camera,
    onTick: () => {
      const elapsedTime = clock.getElapsedTime()
      explosion.material.uniforms.u_time.value = elapsedTime / 10
    },
  })
}

// Playground implementation
type PlaygroundParams = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  onTick?: () => void
  onResize?: (size: Size) => void
}

const createPlayground = ({
  scene,
  camera,
  onTick,
  onResize,
}: PlaygroundParams) => {
  // Canvas
  const canvas = document.getElementById("webgl") as HTMLCanvasElement
  if (!canvas) {
    throw new Error('canvas element with "webgl" id is missing in "index.html"')
  }

  // Stats
  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  // Create size object, which is initialized later by `updateSize()`
  const size = { width: 0, height: 0 }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setClearColor(0xecf0f1)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.rotateSpeed = 2
  controls.enablePan = false
  controls.enableZoom = false

  const updateSize = () => {
    // Update size
    size.width = window.innerWidth
    size.height = window.innerHeight

    // Set pixel ratio to 2 maximum
    const pixelRatio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO)

    // Update camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    // Update renderer and effect composer size and pixel ratio
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(pixelRatio)

    // Create a new instance because `size` object is changed on resize
    onResize?.({ width: size.width, height: size.height })
  }

  // Init size
  updateSize()
  // Listen window to resize the canvas
  window.addEventListener("resize", updateSize)

  const tick = () => {
    stats.begin()
    onTick?.()

    // Update controls for damping
    controls.update()

    // Render
    renderer.render(scene, camera)

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }
  tick()
}

// Start program
main()
