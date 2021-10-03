import * as THREE from "three"
import * as Tweakpan from "tweakpane"
import type { Explosion } from "./"

export const explosionPane = (
  sun: THREE.DirectionalLight,
  { light, fireSmoke, sparkles, streaks, dust, timeline }: Explosion,
): void => {
  const { material: fireSmokeMaterial } = fireSmoke
  const { material: sparklesMaterial } = sparkles
  const { material: streaksMaterial } = streaks
  const [{ material: dustMaterial }] = dust.children as THREE.Mesh<
    THREE.BufferGeometry,
    THREE.RawShaderMaterial
  >[]

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
    pages: [
      { title: "Sun" },
      { title: "Fire smoke" },
      { title: "Sparkles" },
      { title: "Streaks" },
      { title: "Dust" },
    ],
  })

  /* ==================== */
  /* ======== Sun ======= */
  /* ==================== */
  tabs.pages[0].addInput(sun, "intensity", {
    label: "Intensity",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(sun.position, "x", {
    label: "x",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(sun.position, "y", {
    label: "y",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[0].addInput(sun.position, "z", {
    label: "z",
    min: 0,
    max: 10,
    step: 0.01,
  })

  /* ==================== */
  /* ======= Light ====== */
  /* ==================== */
  tabs.pages[1].addInput(light, "intensity", {
    label: "light",
    min: 0,
    max: 5,
    step: 0.01,
  })

  /* ==================== */
  /* ===== Firesmoke ==== */
  /* ==================== */
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_height, "value", {
    label: "height",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_noiseSpeed, "value", {
    label: "speed",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_smokeScale, "value", {
    label: "particule scale",
    min: 0,
    max: 5,
    step: 0.01,
  })
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_noiseScale, "value", {
    label: "noise scale",
    min: 1,
    max: 10,
    step: 0.01,
  })
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_circleLimit, "value", {
    label: "circle limit",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[1].addInput(
    fireSmokeMaterial.uniforms.u_circleSmoothness,
    "value",
    {
      label: "circle smoothness",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_intensity, "value", {
    label: "intensity",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[1].addInput(
    fireSmokeMaterial.uniforms.u_intensitySmoothness,
    "value",
    {
      label: "intensity smoothness",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[1].addInput(fireSmokeMaterial.uniforms.u_transparency, "value", {
    label: "transparency",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[1].addInput(
    fireSmokeMaterial.uniforms.u_transparencySmoothness,
    "value",
    {
      label: "transparency smoothness",
      min: 0,
      max: 2,
      step: 0.01,
    },
  )

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
  tabs.pages[1]
    .addInput(colors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c1.value))
  tabs.pages[1]
    .addInput(colors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c2.value))
  tabs.pages[1]
    .addInput(colors, "c3", {
      label: "color 3",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c3.value))
  tabs.pages[1]
    .addInput(colors, "c4", {
      label: "color 4",
    })
    .on("change", handleColorChange(fireSmokeMaterial.uniforms.u_c4.value))

  /* ==================== */
  /* ===== Sparkles ===== */
  /* ==================== */
  tabs.pages[2].addInput(sparklesMaterial.uniforms.u_sparkleHeight, "value", {
    label: "height",
    min: 0,
    max: 5,
    step: 0.01,
  })
  tabs.pages[2].addInput(sparklesMaterial.uniforms.u_sparkleScale, "value", {
    label: "scale",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[2].addInput(sparklesMaterial.uniforms.u_sparkleRadius, "value", {
    label: "radius",
    min: 0,
    max: 2,
    step: 0.01,
  })
  tabs.pages[2].addInput(
    sparklesMaterial.uniforms.u_sparkleIntensity,
    "value",
    {
      label: "intensity",
      min: 0,
      max: 10,
      step: 0.01,
    },
  )
  // colors
  const sparklesColors = {
    c1: `#${sparklesMaterial.uniforms.u_c1.value.getHexString()}`,
    c2: `#${sparklesMaterial.uniforms.u_c2.value.getHexString()}`,
  }
  tabs.pages[2]
    .addInput(sparklesColors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(sparklesMaterial.uniforms.u_c1.value))
  tabs.pages[2]
    .addInput(sparklesColors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(sparklesMaterial.uniforms.u_c2.value))

  /* ==================== */
  /* ====== Streaks ===== */
  /* ==================== */
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksRadius, "value", {
    label: "radius",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[3].addInput(
    streaksMaterial.uniforms.u_streaksCircleSmooth,
    "value",
    {
      label: "circle smooth",
      min: 0,
      max: 1,
      step: 0.01,
    },
  )
  tabs.pages[3].addInput(
    streaksMaterial.uniforms.u_streaksNoiseOffset,
    "value",
    {
      label: "noise offset",
      min: 0,
      max: 10,
      step: 0.01,
    },
  )
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksNoiseX, "value", {
    label: "noise x",
    min: 0,
    max: 20,
    step: 0.01,
  })
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksNoiseY, "value", {
    label: "noise y",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksMin, "value", {
    label: "min",
    min: 0,
    max: 1,
    step: 0.01,
  })
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksSmooth, "value", {
    label: "smooth",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[3].addInput(streaksMaterial.uniforms.u_streaksAlpha, "value", {
    label: "alpha",
    min: 0,
    max: 1,
    step: 0.01,
  })
  // colors
  const streaksColors = {
    c1: `#${streaksMaterial.uniforms.u_c1.value.getHexString()}`,
    c2: `#${streaksMaterial.uniforms.u_c2.value.getHexString()}`,
    c3: `#${streaksMaterial.uniforms.u_c3.value.getHexString()}`,
  }
  tabs.pages[3]
    .addInput(streaksColors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(streaksMaterial.uniforms.u_c1.value))
  tabs.pages[3]
    .addInput(streaksColors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(streaksMaterial.uniforms.u_c2.value))
  tabs.pages[3]
    .addInput(streaksColors, "c3", {
      label: "color 3",
      view: "color",
    })
    .on("change", handleColorChange(streaksMaterial.uniforms.u_c3.value))

  /* ==================== */
  /* ======= Dust ======= */
  /* ==================== */
  tabs.pages[4].addInput(dustMaterial.uniforms.u_dustRadius, "value", {
    label: "radius",
    min: 0,
    max: 10,
    step: 0.01,
  })
  tabs.pages[4].addInput(dustMaterial.uniforms.u_dustHeight, "value", {
    label: "height",
    min: 0,
    max: 2,
    step: 0.01,
  })
  tabs.pages[4].addInput(dustMaterial.uniforms.u_dustScale, "value", {
    label: "scale",
    min: 0,
    max: 1,
    step: 0.01,
  })
  // colors
  const dustColors = {
    c1: `#${dustMaterial.uniforms.u_c1.value.getHexString()}`,
    c2: `#${dustMaterial.uniforms.u_c2.value.getHexString()}`,
  }
  tabs.pages[4]
    .addInput(dustColors, "c1", {
      label: "color 1",
    })
    .on("change", handleColorChange(dustMaterial.uniforms.u_c1.value))
  tabs.pages[4]
    .addInput(dustColors, "c2", {
      label: "color 2",
      view: "color",
    })
    .on("change", handleColorChange(dustMaterial.uniforms.u_c2.value))
}
