export interface Alpha { a: number }
export interface RGB { r: number, g: number, b: number }
export interface HSL { h: number, s: number, l: number }
export type RGBA = RGB & Alpha
export type HSLA = HSL & Alpha