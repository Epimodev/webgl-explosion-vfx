import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import groundData from "./ground.obj?raw"

export const createGround = (): THREE.Mesh => {
  const textureLoader = new THREE.TextureLoader()
  const textureRepeat = 8
  const groundColor = textureLoader.load(
    "/textures/ground-dirty-rocky/color.jpg",
  )
  const groundRoughness = textureLoader.load(
    "/textures/ground-dirty-rocky/roughness.jpg",
  )
  const groundNormals = textureLoader.load(
    "/textures/ground-dirty-rocky/normals.jpg",
  )
  groundColor.wrapS = THREE.RepeatWrapping
  groundColor.wrapT = THREE.RepeatWrapping
  groundColor.repeat.x = textureRepeat
  groundColor.repeat.y = textureRepeat
  groundRoughness.wrapS = THREE.RepeatWrapping
  groundRoughness.wrapT = THREE.RepeatWrapping
  groundRoughness.repeat.x = textureRepeat
  groundRoughness.repeat.y = textureRepeat
  groundNormals.wrapS = THREE.RepeatWrapping
  groundNormals.wrapT = THREE.RepeatWrapping
  groundNormals.repeat.x = textureRepeat
  groundNormals.repeat.y = textureRepeat

  const objectLoader = new OBJLoader()
  const parsedScene = objectLoader.parse(groundData)
  const parsedMesh = parsedScene.children[0] as THREE.Mesh
  const groundGeometry = parsedMesh.geometry

  // Ground
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundColor,
    roughnessMap: groundRoughness,
    normalMap: groundNormals,
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.position.y = -0.4

  return ground
}
