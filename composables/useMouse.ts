import type { Lecture } from '~/types'

const { parseTime } = useTime()

export default function useMouse(lectures: Ref<Lecture[]>) {
  const isDragging = ref(false)
  const millis = { start: 0, end: 0 }
  const spannedCells = { start: undefined as HTMLTableCellElement | undefined, end: undefined as HTMLTableCellElement | undefined }

  let currentGroup: string | null = null
  let rafId: number | null = null
  let prevCell: HTMLTableCellElement | null = null

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0)
      return

    isDragging.value = true
  }

  function onMouseUp(event: MouseEvent) {
    if (event.button !== 0)
      return

    isDragging.value = false

    if (millis.start !== 0 && millis.end !== 0 && currentGroup !== null) {
      const data = {
        startCell: spannedCells.start!,
        endCell: spannedCells.end!,

        start: new Date(millis.start),
        end: new Date(millis.end),
        group: currentGroup,
      } as Lecture

      lectures.value.push(data)
    }

    millis.start = 0
    millis.end = 0
    currentGroup = null
    spannedCells.start = undefined
    spannedCells.end = undefined
  }

  function onMouseMove(event: MouseEvent) {
    if (!isDragging.value)
      return

    if (rafId !== null)
      cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      const cell = event.target as HTMLTableCellElement
      if (cell.isEqualNode(prevCell))
        return

      const timeData = cell.getAttribute('data-time')
      if (!timeData)
        return

      const currentMillis = {
        start: parseTime(timeData.split('-')[0].replaceAll('@', ':')),
        end: parseTime(timeData.split('-')[1].replaceAll('@', ':')),
      }

      if (millis.start === 0 || currentMillis.start < millis.start) {
        millis.start = currentMillis.start
        spannedCells.start = cell
      }

      millis.end = currentMillis.end
      spannedCells.end = cell

      currentGroup = cell.getAttribute('data-group')

      prevCell = cell
    })
  }

  return {
    lectures,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  }
}
