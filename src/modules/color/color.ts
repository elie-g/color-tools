import { HSLtoRGB, HSVtoRGB, HWBtoRGB } from '@/modules/color/functions'
import { CMYK, HSL, HWB, RGB, xRGB, xRGBA } from '@/modules/color/regex'
import { constrain } from '@/modules/utils/math'
import { reactive } from 'vue'

/**
 * @property {number} r - Red value ∈ [0, 1]
 * @property {number} g - Green value ∈ [0, 1]
 * @property {number} b - Blue value ∈ [0, 1]
 */
export interface RGBValues { r: number, g: number, b: number }
export interface RGBColor { red: number, green: number, blue: number }

/**
 * @property {number} h - Hue ∈ [0, 1]
 * @property {number} s - Saturation ∈ [0, 1]
 * @property {number} l - Lightness ∈ [0, 1]
 */
export interface HSLValues { h: number, s: number, l: number }
export interface HSLColor { hue: number, saturation: number, lightness: number }

/**
 * @property {number} h - Hue ∈ [0, 1]
 * @property {number} s - Saturation ∈ [0, 1]
 * @property {number} v - Value / Brightness ∈ [0, 1]
 */
export interface HSVValues { h: number, s: number, v: number }

/**
 * @property {number} h - Hue ∈ [0, 1]
 * @property {number} w - Whiteness ∈ [0, 1]
 * @property {number} b - Blackness ∈ [0, 1]
 */
export interface HWBValues { h: number, w: number, b: number }
export interface HWBColor { hue: number, whiteness: number, blackness: number }

/**
 * @property {number} c - Cyan ∈ [0, 1]
 * @property {number} m - Magenta ∈ [0, 1]
 * @property {number} y - Yellow ∈ [0, 1]
 * @property {number} k - Black ∈ [0, 1]
 */
export interface CMYKValues { c: number, m: number, y: number, k: number }
export interface CMYKColor { cyan: number, magenta: number, yellow: number, black: number }

export interface IColor {
  readonly rgb: RGBValues & RGBColor
  readonly hsl: HSLValues & HSLColor
  readonly hsv: HSVValues
  readonly hwb: HWBValues & HWBColor
  readonly cmyk: CMYKValues & CMYKColor
  parse(color: string): this
  toString(format?: Format): string
}

export interface IColorAlpha extends IColor {
  alpha: number
  toString(format?: Format, alpha?: boolean): string
}

type _Converters = {
  -readonly [P in keyof IColor]?: IColor[P]
}

export class ColorImpl implements IColorAlpha {
  private readonly _converters: _Converters = {}
  
  r: number = 0
  g: number = 0
  b: number = 0
  a: number = 1
  
  private get min(): number { return Math.min(this.r, this.g, this.b) }
  private get max(): number { return Math.max(this.r, this.g, this.b) }
  
  private hue(): number {
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
  
  private setRGB({ r, g, b }: RGBValues) {
    this.rgb.r = r
    this.rgb.g = g
    this.rgb.b = b
  }
  
  private setHSL(h: number, s: number, l: number): void {
    this.setRGB(HSLtoRGB({ h, s, l }))
  }
  
  private setHWB(h: number, w: number, b: number): void {
    this.setRGB(HWBtoRGB({ h, w, b }))
  }
  
  private setHSV(h: number, s: number, v: number): void {
    this.setRGB(HSVtoRGB({ h, s, v }))
  }
  
  private createRGBConverter(): RGBValues & RGBColor {
    const self = this
    return {
      get r(): number { return self.r },
      set r(r: number) { self.r = r % 1 },
      get red(): number { return Math.round(this.r * 255) },
      set red(r: number) { this.r = r / 255 },
      
      get g(): number { return self.g },
      set g(g: number) { self.g = g % 1},
      get green(): number { return Math.round(this.g * 255) },
      set green(g: number) { this.g = g / 255},
      
      get b(): number { return self.b },
      set b(b: number) { self.b = b % 1 },
      get blue(): number { return Math.round(this.b * 255) },
      set blue(b: number) { this.b = b / 255 },
    }
  }
  
  private createHSLConverter(): HSLValues & HSLColor {
    const self = this
    return {
      get h(): number { return self.hue() },
      set h(h: number) { self.setHSL(h, this.s, this.l) },
      get hue(): number { return this.h * 360 },
      set hue(h: number) { this.h = h / 100 },
      
      get s(): number {
        const delta = self.max - self.min
        return delta === 0 ? 0 : delta / ( 1 - Math.abs(2 * this.l - 1) )
      },
      set s(s: number) { self.setHSL(this.h, s, this.l) },
      get saturation(): number { return this.s * 100 },
      set saturation(s: number) { this.s = s / 100 },
      
      get l(): number { return ( self.max + self.min ) / 2 },
      set l(l: number) { self.setHSL(this.h, this.s, l) },
      get lightness(): number { return this.l * 100 },
      set lightness(l: number) { this.l = l / 100 }
    }
  }
  
  private createHWBConverter(): HWBValues & HWBColor {
    const self = this
    return {
      get h(): number { return self.hue() },
      set h(h: number) { self.setHWB(h, this.w, this.b) },
      get hue(): number { return this.h * 360 },
      set hue(h: number) { this.h = h / 360 },
      
      get w(): number { return self.min },
      set w(w: number) { self.setHWB(this.h, w, this.b) },
      get whiteness(): number { return this.w * 100 },
      set whiteness(w: number) { this.w = w / 100 },
      
      get b(): number { return 1 - self.max },
      set b(b: number) { self.setHWB(this.h, this.w, b) },
      get blackness(): number { return this.b * 100 },
      set blackness(b: number) { this.b = b / 100 }
    }
  }
  
  private createHSVConverter(): HSVValues {
    const self = this
    return {
      get h(): number { return self.hue() },
      set h(h: number) { self.setHSV(h, this.s, this.v) },
      
      get s(): number { return ( self.max - self.min ) / self.max },
      set s(s: number) { self.setHSV(this.h, s, this.v) },
      
      get v(): number { return self.max },
      set v(v: number) { self.setHSV(this.h, this.s, v) },
    }
  }
  
  private createCMYKConverter(): CMYKValues & CMYKColor {
    const self = this
    const toRgb = (v: number, k: number) => 1 - ( v % 1 * ( 1 - k ) + k )
    const toCmyk = (v: number, k: number) => ( 1 - v % 1 - k ) / ( 1 - k )
    return {
      get c(): number { return toCmyk(self.r, this.k) },
      set c(c: number) { self.r = toRgb(c, this.k) },
      get cyan(): number { return this.c * 100 },
      set cyan(c: number) { this.c = c / 100 },
      
      get m(): number { return toCmyk(self.g, this.k) },
      set m(m: number) { self.g = toRgb(m, this.k) },
      get magenta(): number { return this.m * 100 },
      set magenta(m: number) { this.m = m / 100 },
      
      get y(): number { return toCmyk(self.b, this.k) },
      set y(y: number) { self.b = toRgb(y, this.k) },
      get yellow(): number { return this.y * 100 },
      set yellow(y: number) { this.y = y / 100 },
      
      get k(): number { return self.max },
      set k(k: number) {
        k %= 1
        self.r = toRgb(this.c, k)
        self.g = toRgb(this.m, k)
        self.b = toRgb(this.y, k)
      },
      get black(): number { return this.k * 100 },
      set black(k: number) { this.k = k / 100 },
    }
  }
  
  get rgb(): RGBValues & RGBColor {
    if (this._converters.rgb == null)
      this._converters.rgb = this.createRGBConverter()
    return this._converters.rgb
  }
  
  get hsl(): HSLValues & HSLColor {
    if (this._converters.hsl == null)
      this._converters.hsl = this.createHSLConverter()
    return this._converters.hsl
  }
  
  get hwb(): HWBValues & HWBColor {
    if (this._converters.hwb == null)
      this._converters.hwb = this.createHWBConverter()
    return this._converters.hwb
  }
  
  get hsv(): HSVValues {
    if (this._converters.hsv == null)
      this._converters.hsv = this.createHSVConverter()
    return this._converters.hsv
  }
  
  get cmyk(): CMYKValues & CMYKColor {
    if (this._converters.cmyk == null)
      this._converters.cmyk = this.createCMYKConverter()
    return this._converters.cmyk
  }
  get alpha(): number { return this.a }
  set alpha(a: number) { this.a = constrain(a, 0, 1) }
  
  parse(color: string): this {
    color = color.trim()
    const valOrPercent = (val: string, percent: string) =>
      val == null ? parseFloat(percent) / 100 : parseFloat(val)
    
    let res = xRGB.exec(color) ?? xRGBA.exec(color)
    if (res != null) {
      let [r,b,g,a] = res.slice(1, 4)
      this.rgb.red = parseInt(r, 16)
      this.rgb.green = parseInt(g, 16)
      this.rgb.blue = parseInt(b, 16)
      if (a != null) this.alpha = parseInt(a, 16) / 255
      
    } else if ((res = RGB.exec(color)) != null) {
      this.rgb.red = parseInt(res[1]) ?? Math.round(parseFloat(res[2]) / 100 * 255)
      this.rgb.green = parseInt(res[3]) ?? Math.round(parseFloat(res[4]) / 100 * 255)
      this.rgb.blue = parseInt(res[5]) ?? Math.round(parseFloat(res[6]) / 100 * 255)
      if ((res[7] ?? res[8]) != null) this.alpha = valOrPercent(res[7], res[8])
      
    } else if ((res = HSL.exec(color)) != null) {
      this.hsl.l = valOrPercent(res[5], res[6])
      this.hsl.s = valOrPercent(res[3], res[4])
      if ((res[7] ?? res[8]) != null) this.alpha = valOrPercent(res[7], res[8])
      let val = parseFloat(res[1])
      switch(res[2]) {
        case 'grad': val *= 0.9; break
        case 'rad': val *= 180 / Math.PI; break
        case 'turn': val *= 360; break
      }
      this.hsl.hue = val
      
    } else if ((res = HWB.exec(color)) != null) {
      this.hwb.w = valOrPercent(res[3], res[4])
      this.hwb.b = valOrPercent(res[5], res[6])
      if ((res[7] ?? res[8]) != null) this.alpha = valOrPercent(res[7], res[8])
      let val = parseFloat(res[1])
      switch(res[2]) {
        case 'grad': val *= 0.9; break
        case 'rad': val *= 180 / Math.PI; break
        case 'turn': val *= 360; break
      }
      this.hwb.hue = val
      
    } else if ((res = CMYK.exec(color)) != null) {
      this.cmyk.k = valOrPercent(res[7], res[8])
      this.cmyk.c = valOrPercent(res[1], res[2])
      this.cmyk.m = valOrPercent(res[3], res[4])
      this.cmyk.y = valOrPercent(res[5], res[6])
    } else {
      throw 'ERROR: invalid color'
    }
    
    return this
  }
  
  toString(format: Format = 'rgb', alpha?: boolean): string {
    alpha ??= this.alpha !== 1
    switch (format) {
      case 'hex':
        let hex = [ this.r, this.g, this.b ]
        if (alpha) hex.push(this.alpha)
        return '#' + hex.map((c) => Math.round(c * 0xFF)
          .toString(16).padStart(2, '0')).join('')
      
      case 'hsl':
        const hsl = `${this.hsl.hue}deg, ${this.hsl.saturation}%, ${this.hsl.lightness}%`
        return alpha ? `hsla(${hsl}, ${this.alpha})` : `hsl(${hsl})`
      
      case 'cmyk':
        const { cyan, magenta, yellow, black } = this.cmyk
        const cmyk = `device-cmyk(${cyan}% ${magenta}% ${yellow}% ${black}`
        return alpha ? `${cmyk} / ${this.alpha})` : `${cmyk})`
      
      case 'hwb':
        const { hue, whiteness, blackness } = this.hwb
        const hwb = `hwb(${hue}deg, ${whiteness}%, ${blackness}%`
        return alpha ? `${hwb}, ${this.alpha}` : `${hwb})`
      
      case 'rgb':
      default:
        const rgb = [ this.r, this.g, this.b ]
          .map((c) => Math.round(c * 255)).join(', ')
        return alpha ? `rgba(${rgb}, ${this.alpha})` : `rgb(${rgb})`
    }
  }
}

type Format = 'rgb' | 'hex' | 'hsl' | 'hwb' | 'cmyk'


export function Color(color?: string): IColorAlpha {
  return reactive(color == null ? new ColorImpl() : new ColorImpl().parse(color))
}

Color.isValid = function isValid(color: string): boolean {
  color = color.trim()
  return xRGB.test(color) || xRGBA.test(color) || RGB.test(color) ||
    HSL.test(color) || HWB.test(color) || CMYK.test(color)
}