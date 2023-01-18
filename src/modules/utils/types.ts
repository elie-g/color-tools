
export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}

// noinspection JSUnusedGlobalSymbols
export type Optional<T> = {
  [Key in keyof T]?: T[Key]
}

export type DeepReadonly<T> = {
  +readonly [K in keyof T]: DeepReadonly<T[K]>
}