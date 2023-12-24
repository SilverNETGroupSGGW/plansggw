import type { Lecture } from '~/types'

const { parseTime } = useTime()

export default function useMouse(lectures: Lecture[]) {
  const isDragging = ref(false)
  const millis = { start: 0, end: 0 }
  const spannedCells = { start: undefined as HTMLTableCellElement | undefined, end: undefined as HTMLTableCellElement | undefined }

  let currentGroup: string | null = null
  let rafId: number | null = null
  let prevCell: HTMLTableCellElement | null = null

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0)
      return

    isDragging.value = true
  }

  function onPointerUp(event: PointerEvent) {
    if (event.button !== 0)
      return

    isDragging.value = false

    if (millis.start !== 0 && millis.end !== 0 && currentGroup !== null) {
      const data: Lecture = {
        id: lectures.length === 0 ? 0 : lectures.length,

        top: spannedCells.start!.offsetTop,
        left: spannedCells.start!.offsetLeft,
        
        width: spannedCells.end!.offsetLeft - spannedCells.start!.offsetLeft + spannedCells.end!.offsetWidth,
        height: spannedCells.end!.offsetTop - spannedCells.start!.offsetTop + spannedCells.end!.offsetHeight,

        start: new Date(millis.start),
        end: new Date(millis.end),
        group: currentGroup,
      }

      lectures.push(data)
    }

    millis.start = 0
    millis.end = 0
    currentGroup = null
    spannedCells.start = undefined
    spannedCells.end = undefined
  }

  function onPointerMove(event: PointerEvent) {
    if (!isDragging.value)
      return

    if (rafId !== null)
      cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      const cell = event.target as HTMLTableCellElement
      if (cell.isEqualNode(prevCell))
        return

      const timeData = cell.getAttribute('data-time')
      const groupData = cell.getAttribute('data-group')
      if (!timeData || !groupData)
        return

      const [start, end] = timeData.split('-')
        .map(time => parseTime(time.replaceAll('@', ':')))

      if (millis.start === 0 || start < millis.start) {
        millis.start = start
        spannedCells.start = cell
      }

      millis.end = end
      spannedCells.end = cell

      currentGroup = groupData

      prevCell = cell
    })
  }

  return {
    lectures,
    onPointerDown,
    onPointerUp,
    onPointerMove,
  }
}
