import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import {
  createExplosion,
  fireSmokeMaterial,
  fireSmokeParticule,
} from "./explosion"
import { explosionPane } from "./explosion/tweakpane"
import { createGround } from "./ground"
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

  // Lights
  const firstLight = new THREE.PointLight(0xffffff)
  firstLight.intensity = 4
  scene.add(firstLight)
  firstLight.position.x = 3
  firstLight.position.y = 0.2
  firstLight.position.z = 1
  const secondLight = new THREE.PointLight(0xffffff)
  secondLight.intensity = 4
  scene.add(secondLight)
  secondLight.position.x = -1
  secondLight.position.y = 0.1
  secondLight.position.z = -3

  // Ground
  const ground = createGround()
  scene.add(ground)

  // Test with 1 fireSmoke particule
  const material = fireSmokeMaterial()
  const particule = fireSmokeParticule(
    material,
    new THREE.Vector3(0, 0, 0),
    0.5,
  )
  scene.add(particule)

  // Create 1 explosion
  const explosion = createExplosion()
  // scene.add(explosion.light)
  // scene.add(explosion.fireSmoke)
  // scene.add(explosion.sparkles)

  explosion.timeline.seek(0)

  // Setup pane config
  explosionPane(explosion, explosion.timeline)

  // Play button
  const playButton = document.getElementById("play-button")!
  playButton.addEventListener("click", () => {
    explosion.timeline.seek(0)
    explosion.timeline.play()

    playButton.setAttribute("disabled", "")
    setTimeout(() => {
      playButton.removeAttribute("disabled")
    }, 3000)
  })

  const clock = new THREE.Clock()
  clock.start()

  createPlayground({
    scene,
    camera,
    onTick: () => {
      const elapsedTime = clock.getElapsedTime()
      explosion.fireSmoke.material.uniforms.u_time.value = elapsedTime / 10
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
  renderer.setClearColor(0x2c3e50)
  renderer.physicallyCorrectLights = true
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3

  const effectComposer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const bloomRadius = 0
  const bloomThreshold = 0.65
  const bloomStrength = 0.5
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomStrength,
    bloomRadius,
    bloomThreshold,
  )
  effectComposer.addPass(renderPass)
  effectComposer.addPass(bloomPass)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.rotateSpeed = 2
  controls.enablePan = false
  controls.enableZoom = false
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI / 2

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
    effectComposer.setSize(size.width, size.height)
    effectComposer.setPixelRatio(pixelRatio)
    bloomPass.setSize(size.width, size.height)

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
    effectComposer.render()

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }
  tick()
}

// Start program
main()
