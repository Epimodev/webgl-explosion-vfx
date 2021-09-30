import * as THREE from "three"

export const createGround = () => {
  const textureLoader = new THREE.TextureLoader()
  const textureRepeat = 3
  const groundColor = textureLoader.load(
    "/textures/ground-dirty-rocky/color.jpg",
  )
  const groundDisplacement = textureLoader.load(
    "/textures/ground-dirty-rocky/displacement.jpg",
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
  groundDisplacement.wrapS = THREE.RepeatWrapping
  groundDisplacement.wrapT = THREE.RepeatWrapping
  groundDisplacement.repeat.x = textureRepeat
  groundDisplacement.repeat.y = textureRepeat
  groundRoughness.wrapS = THREE.RepeatWrapping
  groundRoughness.wrapT = THREE.RepeatWrapping
  groundRoughness.repeat.x = textureRepeat
  groundRoughness.repeat.y = textureRepeat
  groundNormals.wrapS = THREE.RepeatWrapping
  groundNormals.wrapT = THREE.RepeatWrapping
  groundNormals.repeat.x = textureRepeat
  groundNormals.repeat.y = textureRepeat

  // Ground
  const plane = new THREE.PlaneGeometry(5, 5, 300, 300)
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundColor,
    displacementMap: groundDisplacement,
    displacementScale: 0.1,
    roughnessMap: groundRoughness,
    normalMap: groundNormals,
    transparent: true,
  })
  groundMaterial.envMapIntensity = 1
  const ground = new THREE.Mesh(plane, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.4

  return ground
}
