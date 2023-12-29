export interface Lecture {
  x?: number
  y?: number

  width?: number
  height?: number

  id?: number | string /* ghost id */
  ghost?: boolean
  overlap?: boolean
  zIndex?: number

  start: Date
  end: Date
  group: string[]
}
