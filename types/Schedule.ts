import type { Subject } from "./Subject"

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
