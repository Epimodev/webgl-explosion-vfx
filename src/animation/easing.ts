// Taken from https://easings.net/

export type EasingFunction = (t: number) => number

const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const PI = Math.PI
const c1 = 1.70158
const c3 = c1 + 1
const c4 = (2 * PI) / 3

export const linear: EasingFunction = x => x

export const easeOutQuad: EasingFunction = x => {
  return 1 - (1 - x) * (1 - x)
}
export const easeOutCubic: EasingFunction = x => {
  return 1 - pow(1 - x, 3)
}

export const easeOutQuart: EasingFunction = x => {
  return 1 - pow(1 - x, 4)
}

export const easeOutQuint: EasingFunction = x => {
  return 1 - pow(1 - x, 5)
}

export const easeOutSine: EasingFunction = x => {
  return sin((x * PI) / 2)
}

export const easeOutExpo: EasingFunction = x => {
  return x === 1 ? 1 : 1 - pow(2, -10 * x)
}

export const easeOutCirc: EasingFunction = x => {
  return sqrt(1 - pow(x - 1, 2))
}

export const easeOutBack: EasingFunction = x => {
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)
}

export const easeOutElastic: EasingFunction = x => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1
}

export const easeOutBounce: EasingFunction = x => {
  const n1 = 7.5625
  const d1 = 2.75

  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}
