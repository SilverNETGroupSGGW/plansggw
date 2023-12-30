export interface Subject {
  id?: string
  created?: string
  updated?: string
  scheduleId?: string
  name?: string
  type?: string
  startTime: string
  dayOfWeek?: string
  duration: string
  comment?: string
  groupsIds: string[]
  classroomId?: string
  lecturersIds?: string[]

  /* internal */
  x?: number
  y?: number
  width?: number
  height?: number
  ghost?: boolean
  overlap?: boolean
  zIndex?: number
}
