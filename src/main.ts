import Stats from "stats.js"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { createExplosion } from "./explosion"
import { explosionPane } from "./explosion/tweakpane"
import { createGround } from "./ground"

const MAX_PIXEL_RATIO = 2

const main = () => {
  const scene = new THREE.Scene()

  // Setup camera
  const fov = 50 // degres
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = -5
  camera.position.x = 0
  camera.position.y = 1
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // Lights
  const sun = new THREE.DirectionalLight(0xffffff)
  sun.intensity = 2
  sun.position.x = 6.3
  sun.position.y = 3.5
  sun.position.z = 2
  scene.add(sun)

  const loader = getLoaderControls()

  loadAssets(
    progress => {
      loader.setPercentage(progress)
    },
    assets => {
      loader.hide()
      // return

      // Ground
      const ground = createGround(assets)
      scene.add(ground)

      // Create explosion
      const explosion = createExplosion(assets)
      scene.add(explosion.light)
      scene.add(explosion.fireSmoke)
      scene.add(explosion.sparkles)
      scene.add(explosion.streaks)

      explosion.timeline.seek(0)
      // Setup pane config
      explosionPane(sun, explosion)

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
    },
    () => {
      console.log("ERROR")
    },
  )
}

const getLoaderControls = () => {
  const overlay = document.getElementById("loader-overlay") as HTMLDivElement
  const percentage = overlay.querySelector(
    ".loading-percentage",
  ) as HTMLSpanElement
  const progressBar = overlay.querySelector(
    ".progress-bar-loaded",
  ) as HTMLDivElement

  return {
    setPercentage: (value: number) => {
      const percentageLoaded = value * 100
      percentage.innerHTML = percentageLoaded.toString()
      progressBar.style.transform = `scaleX(${value})`
    },
    hide: () => {
      overlay.classList.add("overlay-fadeout")

      const overlayStyle = getComputedStyle(overlay)
      const transitionDuration =
        parseFloat(overlayStyle.transitionDuration) * 1000
      const transitionDelay = parseFloat(overlayStyle.transitionDelay) * 1000
      // add 500ms to be sure the transition is completed
      const hideTimeout = transitionDuration + transitionDelay + 500

      setTimeout(() => {
        overlay.classList.add("overlay-hidden")
      }, hideTimeout)
    },
    displayError: () => {
      console.log("DISPLAY ERROR")
    },
  }
}

type SceneAssets = {
  groundGeometry: THREE.BufferGeometry
  streaksPlaneGeometry: THREE.BufferGeometry
  textureGroundColor: THREE.Texture
  textureGroundRoughness: THREE.Texture
  textureGroundNormals: THREE.Texture
}

const loadAssets = (
  onProgress: (progress: number) => void,
  onSuccess: (assets: SceneAssets) => void,
  onError: () => void,
) => {
  let failed = false

  // Disable eslint to keep consistency between all assets we load
  let groundGeometry: THREE.BufferGeometry
  let streaksPlaneGeometry: THREE.BufferGeometry
  let textureGroundColor: THREE.Texture // eslint-disable-line
  let textureGroundRoughness: THREE.Texture // eslint-disable-line
  let textureGroundNormals: THREE.Texture // eslint-disable-line

  // Object file loaded in this project contains only 1 object and we only need the geometry
  const extractFirstGeometry = (group: THREE.Group): THREE.BufferGeometry => {
    const mesh = group.children[0] as THREE.Mesh
    return mesh.geometry
  }

  const handleLoad = () => {
    if (!failed) {
      // We are sure assets are loaded and assigned here thanks to loading manager
      onSuccess({
        groundGeometry,
        streaksPlaneGeometry,
        textureGroundColor,
        textureGroundRoughness,
        textureGroundNormals,
      })
    }
  }
  const handleProgress = (_url: string, loaded: number, total: number) => {
    if (!failed) {
      onProgress(loaded / total)
    }
  }
  const handleError = () => {
    failed = true
    onError()
  }
  const manager = new THREE.LoadingManager(
    handleLoad,
    handleProgress,
    handleError,
  )
  const textureLoader = new THREE.TextureLoader(manager)
  const objectLoader = new OBJLoader(manager)

  textureGroundColor = textureLoader.load(
    "/textures/ground-dirty-rocky/color.jpg",
  )
  textureGroundRoughness = textureLoader.load(
    "/textures/ground-dirty-rocky/roughness.jpg",
  )
  textureGroundNormals = textureLoader.load(
    "/textures/ground-dirty-rocky/normals.jpg",
  )
  objectLoader.load("/objects/ground.obj", group => {
    groundGeometry = extractFirstGeometry(group)
  })
  objectLoader.load("/objects/streaks-plane.obj", group => {
    streaksPlaneGeometry = extractFirstGeometry(group)
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
