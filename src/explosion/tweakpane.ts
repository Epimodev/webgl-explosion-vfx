import * as Tweakpan from "tweakpane"
import type { Timeline } from "../animation"

export const explosionPane = (
  material: THREE.RawShaderMaterial,
  timeline: Timeline,
): void => {
  const params = {
    timelineTimestamp: 0,
  }

  const pane = new Tweakpan.Pane()

  // Timeline
  pane
    .addInput(params, "timelineTimestamp", {
      label: "timeline",
      min: 0,
      max: 2000,
      step: 1,
    })
    .on("change", ({ value }) => {
      timeline.seek(value)
    })
  pane.addButton({ title: "Play" }).on("click", () => {
    timeline.play()
  })
  pane.addButton({ title: "Pause" }).on("click", () => {
    timeline.pause()
  })
  pane.addButton({ title: "Reset" }).on("click", () => {
    timeline.seek(0)
  })

  pane.addSeparator()

  // Explosion effect
  pane.addInput(material.uniforms.u_speed, "value", {
    label: "speed",
    min: 0,
    max: 10,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_radius, "value", {
    label: "radius",
    min: 0,
    max: 10,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_particuleScale, "value", {
    label: "particule scale",
    min: 0,
    max: 5,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_noiseScale, "value", {
    label: "noise scale",
    min: 1,
    max: 10,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_circleOffset, "value", {
    label: "circle offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  pane.addInput(material.uniforms.u_circleAmplitude, "value", {
    label: "circle amplitude",
    min: 0,
    max: 1,
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

  // Colors
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
  pane
    .addInput(colors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(material.uniforms.u_c1.value))
  pane
    .addInput(colors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(material.uniforms.u_c2.value))
  pane
    .addInput(colors, "c3", {
      label: "color 3",
    })
    .on("change", handleColorChange(material.uniforms.u_c3.value))
  pane
    .addInput(colors, "c4", {
      label: "color 4",
    })
    .on("change", handleColorChange(material.uniforms.u_c4.value))
}
