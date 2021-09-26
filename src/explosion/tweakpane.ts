import * as Tweakpan from "tweakpane"
import type { Timeline } from "../animation"

export const explosionPane = (timeline: Timeline): void => {
  const params = {
    timelineTimestamp: 0,
  }

  const pane = new Tweakpan.Pane()
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
    console.log("RESET")
    timeline.seek(0)
  })
}
