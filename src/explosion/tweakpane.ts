import * as THREE from "three"
import * as Tweakpan from "tweakpane"
import type { Timeline } from "../animation"

export const explosionPane = (
  {
    fireSmoke,
    sparkles,
  }: {
    fireSmoke: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
    sparkles: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  },
  timeline: Timeline,
): void => {
  const { material: fireSmokeMaterial } = fireSmoke
  const { material: sparklesMaterial } = sparkles

  const params = {
    timelineTimestamp: 0,
  }

  const pane = new Tweakpan.Pane()

  /* ==================== */
  /* ===== Timeline ===== */
  /* ==================== */
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

  const tabs = pane.addTab({
    pages: [{ title: "Fire smoke" }, { title: "Sparkles" }],
  })

  /* ==================== */
  /* ===== Firesmoke ==== */
  /* ==================== */
  tabs.pages[0].addInput(fireSmoke.scale, "y", {
    label: "scale y",
    min: 0,
    max: 3,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_height, "value", {
    label: "height",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_speed, "value", {
    label: "speed",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_radius, "value", {
    label: "radius",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_particuleScale, "value", {
    label: "particule scale",
    min: 0,
    max: 5,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_noiseScale, "value", {
    label: "noise scale",
    min: 1,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_circleOffset, "value", {
    label: "circle offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[0].addInput(
    fireSmokeMaterial.uniforms.u_circleAmplitude,
    "value",
    {
      label: "circle amplitude",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[0].addInput(
    fireSmokeMaterial.uniforms.u_intensityOffset,
    "value",
    {
      label: "intensity offset",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[0].addInput(
    fireSmokeMaterial.uniforms.u_intensityAmplitude,
    "value",
    {
      label: "intensity amplitude",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_alphaOffset, "value", {
    label: "alpha offset",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[0].addInput(fireSmokeMaterial.uniforms.u_alphaAmplitude, "value", {
    label: "alpha amplitude",
    min: 0,
    max: 1,
    step: 0.01,
  })

  // Colors
  const colors = {
    c1: `#${fireSmokeMaterial.uniforms.u_c1.value.getHexString()}`,
    c2: `#${fireSmokeMaterial.uniforms.u_c2.value.getHexString()}`,
    c3: `#${fireSmokeMaterial.uniforms.u_c3.value.getHexString()}`,
    c4: `#${fireSmokeMaterial.uniforms.u_c4.value.getHexString()}`,
  }
  const handleColorChange =
    (colorInstance: THREE.Color) =>
    ({ value }: Tweakpan.TpChangeEvent<string>) => {
      colorInstance.set(value)
    }
  tabs.pages[0]
    .addInput(colors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c1.value))
  tabs.pages[0]
    .addInput(colors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c2.value))
  tabs.pages[0]
    .addInput(colors, "c3", {
      label: "color 3",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c3.value))
  tabs.pages[0]
    .addInput(colors, "c4", {
      label: "color 4",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c4.value))

  /* ==================== */
  /* ===== Sparkles ===== */
  /* ==================== */
  tabs.pages[1].addInput(sparklesMaterial.uniforms.u_sparkleHeight, "value", {
    label: "height",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[1].addInput(sparklesMaterial.uniforms.u_sparkleScale, "value", {
    label: "scale",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[1].addInput(sparklesMaterial.uniforms.u_sparkleRadius, "value", {
    label: "radius",
    min: 1,
    max: 2,
    step: 0.01,
  })
}
