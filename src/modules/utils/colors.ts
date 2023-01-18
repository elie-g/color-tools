
export function color(gray: number, alpha?: number): string
export function color(r: number, g: number, b: number, a?: number): string
export function color(color: Array<number>): string
export function color(r: number | Array<number>, g?: number, b?: number, a?: number): string {
  let color: Array<number>
  let length = arguments.length
  if (Array.isArray(r)) {
    length = r.length
    a = r[3]
    b = r[2]
    g = r[1]
    r = r[0]
  }
  
  switch (length) {
    case 1:
      color = [r, r, r]
      break;
    case 2:
      color = [r, r, r, g ?? 0]
      break;
    case 3:
      color = [r, g ?? 0, b ?? 0]
      break;
    case 4:
    default:
      color = [r, g ?? 0, b ?? 0, a ?? 0]
      break;
  }
  
  return `${color.length === 3 ? 'rgb' : 'rgba'}(${color.join(',')})`
}