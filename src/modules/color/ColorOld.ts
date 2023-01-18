import { constrain } from '@/modules/utils/math'
import { HSLtoRGB } from '@/modules/color/functions'
import { HSL, RGB, xRGB, xRGBA } from '@/modules/color/regex'
import { reactive } from 'vue'

export type Format = 'hex' | 'rgb' | 'hsl' | 'hwb'

export interface IColor {
  red: number
  green: number
  blue: number
  
  hue: number
  saturation: number
  lightness: number
  
  whiteness: number
  blackness: number
  
  hsl(h: number, s: number, l: number): this
  rgb(r: number, g: number, b: number): this
  
  parse(color: string): this
  toString(format?: Format): string
  clone(): IColor
}

export interface IColorAlpha extends IColor {
  alpha: number
  
  toString(format?: Format, alpha?: boolean): string
  clone(): IColorAlpha
}

export class ColorImpl implements IColor, IColorAlpha {
  private r: number
  private g: number
  private b: number
  private a: number
  
  constructor() {
    this.r = this.g = this.b = 0
    this.a = 1
  }
  
  get red(): number { return Math.round(this.r * 255) }
  set red(r: number) { this.r = constrain(r, 0, 255) / 255 }
  
  get green(): number { return Math.round(this.g * 255) }
  set green(g: number) { this.g = constrain(g, 0, 255) / 255 }
  
  get blue(): number { return Math.round(this.b * 255) }
  set blue(b: number) { this.b = constrain(b, 0, 255) / 255 }
  
  get hue(): number {
    const max = this.max, min = this.min, delta = max - min
    let hue   = 0
    if (delta !== 0) {
      if (this.r === max)
        hue = ( this.g - this.b ) / delta % 6
      else if (this.g === max)
        hue = ( this.b - this.r ) / delta + 2
      else
        hue = ( this.r - this.g ) / delta + 4
      hue *= 60
      if (hue < 0) hue += 360
    }
    return hue
  }
  
  set hue(h: number) { this.hsl(h, this.saturation, this.lightness) }
  
  get saturation(): number {
    const delta = this.max - this.min
    return delta === 0 ? 0 : delta / ( 1 - Math.abs(2 * this.lightness - 1) )
  }
  set saturation(s: number) { this.hsl(this.hue, s, this.lightness) }
  
  get lightness(): number { return ( this.max + this.min ) / 2 }
  set lightness(l: number) { this.hsl(this.hue, this.saturation, l) }
  
  get whiteness(): number { return Math.min(this.r, this.g, this.b) }
  // TODO set whiteness
  
  get blackness(): number { return 1 - Math.max(this.r, this.g, this.b) }
  
  get alpha(): number { return this.a }
  set alpha(a: number) { this.a = constrain(a, 0, 1) }
  
  rgb(r: number, g: number, b: number): this {
    this.red   = r
    this.green = g
    this.blue  = b
    return this
  }
  
  hsl(h: number, s: number, l: number): this {
    let { r, g, b } = HSLtoRGB({ h, s, l })
    return this.rgb(r, g, b)
  }
  
  private get max(): number { return Math.max(this.r, this.g, this.b) }
  private get min(): number { return Math.min(this.r, this.g, this.b) }
  
  parse(color: string): this {
    color   = color.trim()
    let res = xRGB.exec(color) ?? xRGBA.exec(color)
    
    if (res != null) {
      let [ r, g, b, a ] = res.slice(1, 4)
      this.rgb(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16))
      this.alpha = parseInt(a ?? 'FF', 16) / 255
    } else if (( res = RGB.exec(color) ) != null) {
      this.red   = parseInt(res[1]) ?? Math.round(parseFloat(res[2]) / 100 * 255)
      this.green = parseInt(res[3]) ?? Math.round(parseFloat(res[4]) / 100 * 255)
      this.blue  = parseInt(res[5]) ?? Math.round(parseFloat(res[6]) / 100 * 255)
      this.alpha = parseFloat(res[7]) ?? parseFloat(res[8] ?? 100) / 100
    } else if (( res = HSL.exec(color) ) != null) {
      let val = parseFloat(res[1])
      switch (res[2]) {
        case 'grad':
          val *= 0.9
          break
        case 'rad':
          val *= 180 / Math.PI
          break
        case 'turn':
          val *= 360
          break
      }
      
      this.hsl(val, parseFloat(res[3]) / 100, parseFloat(res[4]) / 100)
      this.alpha = parseFloat(res[5]) ?? parseFloat(res[6] ?? 100) / 100
    } else {
      throw 'ERROR: invalid color'
    }
    return this
  }
  
  static parse(color: string): IColorAlpha {
    return reactive(new ColorImpl().parse(color))
  }
  
  
  toString(format: Format = 'rgb', alpha?: boolean): string {
    alpha ??= this.alpha !== 1
    
    switch (format) {
      case 'hex':
        let hex = [ this.red, this.green, this.blue ]
        if (alpha) hex.push(Math.round(this.alpha * 255))
        return '#' + hex.map((c) => c.toString(16).padStart(2, '0')).join('')
      case 'hsl':
        const hsl = `${this.hue}, ${this.saturation * 100}%, ${this.lightness}%`
        return alpha ? `hsla(${hsl}, ${this.alpha})` : `hsl(${hsl})`
      case 'rgb':
      default:
        const rgb = [ this.red, this.green, this.blue ].join(', ')
        return alpha ? `rgba(${rgb}, ${this.alpha})` : `rgb(${rgb})`
    }
  }
  
  clone(): IColorAlpha {
    let clone = new ColorImpl()
    clone.r = this.r
    clone.g = this.g
    clone.b = this.b
    clone.a = this.a
    return reactive(clone)
  }
}

export function Color(color?: string): IColorAlpha {
  return color != null ? ColorImpl.parse(color) : reactive(new ColorImpl())
}

Color.isValid = function isValid(color: string): boolean {
  color = color.trim()
  return xRGB.test(color) || xRGBA.test(color) || RGB.test(color) || HSL.test(color)
}