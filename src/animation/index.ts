import { invLerp, lerp } from "../math"
import { EasingFunction } from "./easing"

// use an API with delay and duration to avoid errors as overlaping startAt and endAt and ensure the order of values as having endAt < startAt
type TimelineKeyframe = {
  delay?: number
  duration: number
  value: number
  easing: EasingFunction
}

type TimelineVariable<T = any> = {
  target: T
  key: keyof T
  initialValue: number
  keyframes: TimelineKeyframe[]
}

// Convert internally animations with startAt and endAt to make value computation easier with animation timestamp
type ComputedKeyframe = {
  startAt: number
  endAt: number
  from: number
  to: number
  easing: EasingFunction
}

type ComputedTimelineVariable<T = any> = {
  target: T
  key: keyof T
  keyframes: ComputedKeyframe[]
}

const computeKeyframes = (
  initialValue: number,
  keyframes: TimelineKeyframe[],
): ComputedKeyframe[] => {
  const result: ComputedKeyframe[] = []
  let previousKeyframe: ComputedKeyframe | undefined

  for (const { delay = 0, duration, value, easing } of keyframes) {
    if (delay > 0) {
      const startAt = previousKeyframe?.endAt ?? 0
      const endAt = startAt + delay
      const delayValue = previousKeyframe?.to ?? initialValue
      const delayKeyframe = {
        startAt,
        endAt,
        from: delayValue,
        to: delayValue,
        easing,
      }
      result.push(delayKeyframe)
      previousKeyframe = delayKeyframe
    }

    const startAt = previousKeyframe?.endAt ?? 0
    const endAt = startAt + duration
    const from = previousKeyframe?.to ?? initialValue
    const to = value
    const keyframe = {
      startAt,
      endAt,
      from,
      to,
      easing,
    }
    result.push(keyframe)
    previousKeyframe = keyframe
  }

  return result
}

const computeTimeline = (
  variables: TimelineVariable[],
): ComputedTimelineVariable[] => {
  return variables.map(({ target, key, initialValue, keyframes }) => {
    return {
      target,
      key,
      keyframes: computeKeyframes(initialValue, keyframes),
    }
  })
}

const findKeyframe = (
  keyframes: ComputedKeyframe[],
  timestamp: number,
): ComputedKeyframe => {
  const firstKeyframe = keyframes[0]
  const lastKeyframe = keyframes[keyframes.length - 1]
  if (timestamp < firstKeyframe.startAt) {
    return firstKeyframe
  }
  if (timestamp > lastKeyframe.endAt) {
    return lastKeyframe
  }

  return keyframes.find(
    ({ startAt, endAt }) => timestamp >= startAt && timestamp <= endAt,
  )!
}

const getValue = (
  { keyframes }: ComputedTimelineVariable,
  timestamp: number,
): number => {
  const { startAt, endAt, from, to, easing } = findKeyframe(
    keyframes,
    timestamp,
  )
  // if the value is constant during a part of the animation
  if (from === to) {
    return from
  }

  const progress = invLerp(startAt, endAt, timestamp)
  // if animation hasn't started or is completed, no need to compute easing
  if (progress <= 0) {
    return from
  }
  if (progress >= 1) {
    return to
  }

  const valueProgress = easing(progress)
  return lerp(from, to, valueProgress)
}

const isTimelineCompleted = (
  variables: ComputedTimelineVariable[],
  timestamp: number,
): boolean => {
  return variables.every(({ keyframes }) => {
    const lastKeyframe = keyframes[keyframes.length - 1]
    return lastKeyframe.endAt < timestamp
  })
}

export class Timeline {
  private frame: number | null
  private variables: ComputedTimelineVariable[]
  private listeners: (() => void)[]
  timestamp: number

  constructor(variables: TimelineVariable[]) {
    this.frame = null
    this.variables = computeTimeline(variables)
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

      for (const variable of this.variables) {
        const value = getValue(variable, this.timestamp)
        variable.target[variable.key] = value
      }

      const completed = isTimelineCompleted(this.variables, this.timestamp)
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
      this.frame = null
    }
  }

  seek(timestamp: number): void {
    this.timestamp = timestamp

    for (const variable of this.variables) {
      const value = getValue(variable, this.timestamp)
      variable.target[variable.key] = value
    }
  }

  running(): boolean {
    return this.frame != null
  }

  addEventListener(_type: "completed", listener: () => void): void {
    this.listeners.push(listener)
  }

  removeEventListener(_type: "completed", listener: () => void): void {
    const index = this.listeners.indexOf(listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}
