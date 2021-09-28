// Taken from https://easings.net/

export type EasingFunction = (t: number) => number

const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos
const PI = Math.PI
const c1 = 1.70158
const c2 = c1 * 1.525
const c3 = c1 + 1
const c4 = (2 * PI) / 3
const c5 = (2 * PI) / 4.5

export const linear: EasingFunction = x => x

export const easeInQuad: EasingFunction = x => {
  return x * x
}

export const easeOutQuad: EasingFunction = x => {
  return 1 - (1 - x) * (1 - x)
}

export const easeInOutQuad: EasingFunction = x => {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2
}

export const easeInCubic: EasingFunction = x => {
  return x * x * x
}

export const easeOutCubic: EasingFunction = x => {
  return 1 - pow(1 - x, 3)
}

export const easeInOutCubic: EasingFunction = x => {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2
}

export const easeInQuart: EasingFunction = x => {
  return x * x * x * x
}

export const easeOutQuart: EasingFunction = x => {
  return 1 - pow(1 - x, 4)
}

export const easeInOutQuart: EasingFunction = x => {
  return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2
}

export const easeInQuint: EasingFunction = x => {
  return x * x * x * x * x
}

export const easeOutQuint: EasingFunction = x => {
  return 1 - pow(1 - x, 5)
}

export const easeInOutQuint: EasingFunction = x => {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2
}

export const easeInSine: EasingFunction = x => {
  return 1 - cos((x * PI) / 2)
}

export const easeOutSine: EasingFunction = x => {
  return sin((x * PI) / 2)
}

export const easeInOutSine: EasingFunction = x => {
  return -(cos(PI * x) - 1) / 2
}

export const easeInExpo: EasingFunction = x => {
  return x === 0 ? 0 : pow(2, 10 * x - 10)
}

export const easeOutExpo: EasingFunction = x => {
  return x === 1 ? 1 : 1 - pow(2, -10 * x)
}

export const easeInOutExpo: EasingFunction = x => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2
}

export const easeInCirc: EasingFunction = x => {
  return 1 - sqrt(1 - pow(x, 2))
}

export const easeOutCirc: EasingFunction = x => {
  return sqrt(1 - pow(x - 1, 2))
}

export const easeInOutCirc: EasingFunction = x => {
  return x < 0.5
    ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
    : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2
}

export const easeInBack: EasingFunction = x => {
  return c3 * x * x * x - c1 * x * x
}

export const easeOutBack: EasingFunction = x => {
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)
}

export const easeInOutBack: EasingFunction = x => {
  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
}

export const easeInElastic: EasingFunction = x => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4)
}

export const easeOutElastic: EasingFunction = x => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1
}

export const easeInOutElastic: EasingFunction = x => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1
}

export const easeInBounce: EasingFunction = x => {
  return 1 - easeOutBounce(1 - x)
}

export const easeOutBounce: EasingFunction = (x): number => {
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

export const easeInOutBounce: EasingFunction = x => {
  return x < 0.5
    ? (1 - easeOutBounce(1 - 2 * x)) / 2
    : (1 + easeOutBounce(2 * x - 1)) / 2
}
