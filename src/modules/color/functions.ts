import { HSLValues, HSVValues, HWBValues, RGBValues } from '@/modules/color/color'

/**
 * Transform a {@link HSLValues} into a {@link RGBValues} color.
 *
 * @param {HSLValues} hsl
 * @param {number} hsl.h - Hue ∈ [0, 1]
 * @param {number} hsl.s - Saturation ∈ [0, 1]
 * @param {number} hsl.l - Lightness ∈ [0, 1]
 */
export function HSLtoRGB({ h, s, l }: HSLValues): RGBValues {
  if (( h %= 1 ) < 0) h += 1
  
  const c = ( 1 - Math.abs(2 * l - 1) ) * s,
        x = c * ( 1 - Math.abs(( h / 60 ) % 2 - 1) ),
        m = l - c / 2
  
  let rgb
  if (0 <= h && h < 60) {
    rgb = [ c, x, 0 ]
  } else if (60 <= h && h < 120) {
    rgb = [ x, c, 0 ]
  } else if (120 <= h && h < 180) {
    rgb = [ 0, c, x ]
  } else if (180 <= h && h < 240) {
    rgb = [ 0, x, c ]
  } else if (240 <= h && h < 300) {
    rgb = [ x, 0, c ]
  } else {
    rgb = [ c, 0, x ]
  }
  rgb = rgb.map((v) => v + m)
  
  return { r: rgb[0], g: rgb[1], b: rgb[2] }
}

export function HWBtoRGB({ h, w, b }: HWBValues): RGBValues {
  if (w + b >= 1) {
    const gray = w / ( w + b )
    return { r: gray, g: gray, b: gray }
  }
  
  let rgb = HSLtoRGB({ h, s: 1, l: .5 }) as any
  for (let c of [ 'r', 'g', 'b' ]) {
    rgb[c] *= 1 - w - b
    rgb[c] += w
  }
  return rgb
}

export function HSVtoRGB({ h, s, v }: HSVValues): RGBValues {
  const i = Math.floor(h * 6),
        f = h * 6 - i,
        p = v * ( 1 - s ),
        q = v * ( 1 - f * s ),
        t = v * ( 1 - ( 1 - f ) * s )
  
  switch(i % 6) {
    case 0: return { r: v, g: t, b: p }
    case 1: return { r: q, g: v, b: p }
    case 2: return { r: p, g: v, b: t }
    case 3: return { r: p, g: q, b: v }
    case 4: return { r: t, g: p, b: v }
    case 5: return { r: v, g: p, b: q }
    default: return { r: 0, g: 0, b: 0 }
  }
}