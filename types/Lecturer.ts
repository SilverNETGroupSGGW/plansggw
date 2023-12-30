import type { Subject } from "./Subject"

export interface Lecturer {
  id: string
  created?: string
  updated?: string
  firstName: string
  surname: string
  academicDegree: string
  email: string
  subjects?: Subject[]
}
