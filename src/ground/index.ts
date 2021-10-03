import * as THREE from "three"

type GroundAssets = {
  groundGeometry: THREE.BufferGeometry
  textureGroundColor: THREE.Texture
  textureGroundRoughness: THREE.Texture
  textureGroundNormals: THREE.Texture
}

export const createGround = ({
  groundGeometry,
  textureGroundColor,
  textureGroundRoughness,
  textureGroundNormals,
}: GroundAssets): THREE.Mesh => {
  const textureRepeat = 8

  textureGroundColor.wrapS = THREE.RepeatWrapping
  textureGroundColor.wrapT = THREE.RepeatWrapping
  textureGroundColor.repeat.x = textureRepeat
  textureGroundColor.repeat.y = textureRepeat
  textureGroundRoughness.wrapS = THREE.RepeatWrapping
  textureGroundRoughness.wrapT = THREE.RepeatWrapping
  textureGroundRoughness.repeat.x = textureRepeat
  textureGroundRoughness.repeat.y = textureRepeat
  textureGroundNormals.wrapS = THREE.RepeatWrapping
  textureGroundNormals.wrapT = THREE.RepeatWrapping
  textureGroundNormals.repeat.x = textureRepeat
  textureGroundNormals.repeat.y = textureRepeat

  // Ground
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: textureGroundColor,
    roughnessMap: textureGroundRoughness,
    normalMap: textureGroundNormals,
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.position.y = -0.4

  return ground
}
