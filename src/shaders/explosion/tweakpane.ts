import * as THREE from "three"
import * as Tweakpan from "tweakpane"

export const explosionPane = (material: THREE.RawShaderMaterial): void => {
  const colors = {
    c1: `#${material.uniforms.u_c1.value.getHexString()}`,
    c2: `#${material.uniforms.u_c2.value.getHexString()}`,
    c3: `#${material.uniforms.u_c3.value.getHexString()}`,
    c4: `#${material.uniforms.u_c4.value.getHexString()}`,
  }
  const handleColorChange =
    (colorInstance: THREE.Color) =>
    ({ value }: Tweakpan.TpChangeEvent<string>) => {
      colorInstance.set(value)
    }
  const pane = new Tweakpan.Pane()
  pane.addInput(material.uniforms.u_speed, "value", {
    label: "speed",
    min: 0,
    max: 10,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_intensityOffset, "value", {
    label: "intensity offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_intensityAmplitude, "value", {
    label: "intensity amplitude",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_alphaOffset, "value", {
    label: "alpha offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_alphaAmplitude, "value", {
    label: "alpha amplitude",
    min: 0,
    max: 1,
    step: 0.01,
  })
  const c1Input = pane.addInput(colors, "c1", {
    label: "color 1",
  })
  const c2Input = pane.addInput(colors, "c2", {
    label: "color 2",
    view: "color",
  })
  const c3Input = pane.addInput(colors, "c3", {
    label: "color 3",
  })
  const c4Input = pane.addInput(colors, "c4", {
    label: "color 4",
  })
  c1Input.on("change", handleColorChange(material.uniforms.u_c1.value))
  c2Input.on("change", handleColorChange(material.uniforms.u_c2.value))
  c3Input.on("change", handleColorChange(material.uniforms.u_c3.value))
  c4Input.on("change", handleColorChange(material.uniforms.u_c4.value))
}
