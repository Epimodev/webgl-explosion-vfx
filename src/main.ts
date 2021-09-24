import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { explosionMaterial } from "./shaders/explosion"
import { explosionPane } from "./shaders/explosion/tweakpane"
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
  camera.position.z = 15
  camera.position.x = 0
  camera.position.y = 0
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // Setup plane with explosion shader
  const geometry = new THREE.PlaneGeometry(4, 4)
  const material = explosionMaterial({})
  const explosionPlane1 = new THREE.Mesh(geometry, material)
  explosionPlane1.position.set(0, 0, 1)
  scene.add(explosionPlane1)
  const explosionPlane2 = new THREE.Mesh(geometry, material)
  explosionPlane2.position.set(5, 2, 0)
  scene.add(explosionPlane2)
  const explosionPlane3 = new THREE.Mesh(geometry, material)
  explosionPlane3.position.set(-4, 3, -2)
  scene.add(explosionPlane3)

  // Setup pane config
  explosionPane(material)

  const clock = new THREE.Clock()
  clock.start()

  createPlayground({
    scene,
    camera,
    onTick: () => {
      const elapsedTime = clock.getElapsedTime()
      material.uniforms.u_time.value = elapsedTime / 10
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
  controls.maxDistance = 30
  controls.minDistance = 1

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
