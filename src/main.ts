import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass"
import { uvGridMaterial } from "./shaders/uvGrid"
import "./style.css"

const MAX_PIXEL_RATIO = 2

const main = () => {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    50,
    1, // default aspect ratio updated before first render by createThreePlayground
    0.1,
    100,
  )
  camera.position.z = 3
  camera.position.x = 1
  camera.position.y = 1
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  const backgroundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    uvGridMaterial({
      scale: 10,
      color1: new THREE.Color(0xecf0f1),
      color2: new THREE.Color(0x7f8c8d),
    }),
  )
  scene.add(backgroundPlane)

  const axes = new THREE.AxesHelper(3)
  scene.add(axes)

  createPlayground({ scene, camera })
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
  stats.showPanel(1)
  document.body.appendChild(stats.dom)

  // Create size object, which is initialized later by `updateSize()`
  const size = { width: 0, height: 0 }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  })
  const effectComposer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  // @ts-expect-error
  const antialiasingPass = new SSAARenderPass(scene, camera)
  effectComposer.addPass(renderPass)
  effectComposer.addPass(antialiasingPass)

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
    effectComposer.setSize(size.width, size.height)
    effectComposer.setPixelRatio(pixelRatio)

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
