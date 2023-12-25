export interface Lecture {
  top: number
  left: number
  width: number
  height: number
  z?: number

  id: number | string /* ghost id */
  ghost?: boolean

  start: Date
  end: Date
  group: string[]
}
