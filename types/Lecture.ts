export interface Lecture {
  x: number
  y: number

  width: number
  height: number

  id: number | string /* ghost id */
  ghost?: boolean

  start: Date
  end: Date
  group: string[]
}
