import type { Lecture } from '~/types'

export default function useLecture() {
  function calculatePosition(lecture: Lecture, cellHeight: number, groups: string[]) {
    const x = (lecture.start.getHours() - 8) * 48 * 12 + lecture.start.getMinutes() * 0.8
    const y = (groups.length - lecture.group.length) * cellHeight
    const height = lecture.group.length * cellHeight

    const width = ((lecture.end.getHours() * 60 + lecture.end.getMinutes()) - (lecture.start.getHours() * 60 + lecture.start.getMinutes())) * 9.6

    return {
      x,
      y,
      width,
      height,
    }
  }

  return {
    calculatePosition,
  }
}
