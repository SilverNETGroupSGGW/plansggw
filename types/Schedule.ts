import type { Lecturer } from './Lecturer'
import type { Lesson } from './Lesson'
import type { Classroom } from './Classroom'
import type { Group } from './Group'
import type { Subject } from './Subject'

export interface Schedule {
  id: string
  created?: string
  updated?: string
  startDate: string
  name: string
  year: number
  semester: number
  faculty: string
  fieldOfStudy: string
  studyMode: string
  degreeOfStudy: string
  subjects: Subject[]
}

export interface ScheduleExtended {
  id: string
  created?: string
  updated?: string
  scheduleId: string
  name: string
  type: string
  startTime: string
  dayOfWeek: string
  duration: string
  isRemote: boolean
  comment: string
  lecturers: Lecturer[]
  groups: Group[]
  lessons: Lesson[]
  classroom: Classroom
}
