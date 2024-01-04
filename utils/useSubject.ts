import type { Subject } from '~/types'

export default function useSubject() {
  function calculatePosition(subject: Subject, cellHeight: number, groups: string[]) {
    const startTime = new Date(`1970-01-01T${subject.startTime}`)

    const [hours, minutes, seconds] = subject.duration.split(':').map(Number)
    const duration = new Date(`1970-01-01T00:00:00Z`)
    duration.setHours(hours, minutes, seconds)

    const durationInMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000
    const endTime = new Date(startTime.getTime() + durationInMilliseconds)

    const x = (startTime.getHours() - 8) * 24 * 12 + startTime.getMinutes() * 0.8
    const y = (groups.length - subject.groups!.length) * cellHeight
    const height = subject.groups!.length * cellHeight
    const width = ((endTime.getHours() * 60 + endTime.getMinutes()) - (startTime.getHours() * 60 + startTime.getMinutes())) * 4.8

    return { x, y, width, height }
  }

  return {
    calculatePosition,
  }
}
