export const lerp = (min: number, max: number, value: number): number => {
  return (max - min) * value + min
}

export const invLerp = (min: number, max: number, value: number): number => {
  return (value - min) / (max - min)
}
