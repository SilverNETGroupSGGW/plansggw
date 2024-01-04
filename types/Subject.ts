import type { Classroom } from './Classroom'
import type { Group } from './Group'
import type { Lecturer } from './Lecturer'
import type { Lesson } from './Lesson'

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
  isRemote?: boolean
  comment?: string
  lecturers?: Lecturer[]
  groups?: Group[]
  lessons?: Lesson[]
  classroom?: Classroom

  /* internal */
  x?: number
  y?: number
  width?: number
  height?: number
  ghost?: boolean
  overlap?: boolean
  zIndex?: number
}
