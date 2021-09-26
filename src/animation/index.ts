import { EasingFunction } from "./easing"

type AnimationTimelineItem<T = any> = {
  startAt: number
  endAt: number
  easing: EasingFunction
  target: T
  key: keyof T
  from: number
  to: number
}

const lerp = (min: number, max: number, value: number): number => {
  return (max - min) * value + min
}

const invLerp = (min: number, max: number, value: number): number => {
  return (value - min) / (max - min)
}

const clamp = (value: number): number => {
  return Math.min(Math.max(value, 0), 1)
}

export class Timeline {
  private frame: number | null
  private items: AnimationTimelineItem[]
  private timestamp: number
  private listeners: (() => void)[]

  constructor(items: AnimationTimelineItem[]) {
    this.frame = null
    this.items = items
    this.timestamp = 0
    this.listeners = []
  }

  play(): void {
    if (this.running()) {
      return
    }

    let lastTimestamp = Date.now()

    const tick = () => {
      const now = Date.now()
      const elapsedTimeFromLastFrame = now - lastTimestamp
      lastTimestamp = now
      this.timestamp += elapsedTimeFromLastFrame

      let completed = true

      for (const item of this.items) {
        // if timestamp is upper than animation end, we set the value to the final value
        const progress = Math.min(
          invLerp(item.startAt, item.endAt, this.timestamp),
          1,
        )
        if (progress < 1) {
          completed = false
        }
        // if this item animatin hasn't started
        if (progress <= 0) {
          continue
        }

        const animationProgress = item.easing(progress)
        const value = lerp(item.from, item.to, animationProgress)
        item.target[item.key] = value
      }

      if (completed) {
        for (const completeListener of this.listeners) {
          completeListener()
        }
        this.frame = null
      } else {
        this.frame = requestAnimationFrame(tick)
      }
    }

    this.frame = requestAnimationFrame(tick)
  }

  pause(): void {
    if (this.frame != null) {
      cancelAnimationFrame(this.frame)
    }
  }

  seek(timestamp: number): void {
    this.timestamp = timestamp

    for (const item of this.items) {
      // clamp value between 0 and 1
      const progress = clamp(invLerp(item.startAt, item.endAt, this.timestamp))

      const animationProgress = item.easing(progress)
      const value = lerp(item.from, item.to, animationProgress)
      item.target[item.key] = value
    }
  }

  running(): boolean {
    return this.frame != null
  }

  addEventListener(type: "completed", listener: () => void): void {
    this.listeners.push(listener)
  }

  removeEventListener(type: "completed", listener: () => void): void {
    const index = this.listeners.indexOf(listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}
