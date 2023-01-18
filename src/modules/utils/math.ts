type Pos = [ number, number ] | {x: number, y: number}
type distanceFunc = (p1: Pos, p2: Pos) => number
export const distance: distanceFunc = (p1: any, p2: any) => {
  let x1 = p1.x ?? p1[0],
      x2 = p2.x ?? p2[0],
      y1 = p1.y ?? p1[1],
      y2 = p2.y ?? p2[1]
  return Math.sqrt(( x2 - x1 ) ** 2 + ( y2 - y1 ) ** 2)
}

export function constrain(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function round(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.round(value * e) / e
}

export function floor(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.floor(value * e) / e
}

export function ceil(value: number, b: number = 0): number {
  const e = 10 ** b
  return Math.ceil(value * e) / e
}

export function isBetween(value: number, min: number, max: number, inclusive: boolean = false): boolean {
  return inclusive
    ? min <= value && value <= max
    : min < value && value < max
}