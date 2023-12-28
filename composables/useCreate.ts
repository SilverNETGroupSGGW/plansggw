import type { Lecture } from '~/types'

export default function useCreate(lectures: Lecture[], container: Ref<HTMLElement | null>, groupCells: Ref<HTMLElement[]>) {
  const mouse = useMouse()

  const { onResizeDown } = useResize(lectures, container, groupCells)

  function onCreateMove(event: PointerEvent) {
    if (event.button !== 0)
      return

    const target = event.target as HTMLElement

    // Prevent creating a new lecture when clicking on an existing lecture
    if (target.id.startsWith('lecture-'))
      return

    let x = Math.round((event.clientX - container.value!.getBoundingClientRect().left - 48 + 12) / 48) * 48
    let y = Math.round((event.clientY - container.value!.getBoundingClientRect().top - groupCells.value[0].offsetHeight + 12) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

    // Check if x or y is outside the bounds and set them to the closest boundary
    const containerRect = container.value!.getBoundingClientRect()
    if (x < 0)
      x = 0
    if (y < 0)
      y = 0
    if (x > containerRect.width - 48)
      x = containerRect.width - 48
    if (y > containerRect.height - groupCells.value[0].offsetHeight)
      y = containerRect.height - groupCells.value[0].offsetHeight

    const newLecture: Lecture = {
      x,
      y,
      width: 48,
      height: groupCells.value[0].offsetHeight,
      group: ['1'],
      start: new Date(),
      end: new Date(),
      id: lectures.length + 1,
      ghost: true,
    }
    mouse.resizeEdge = 'bottom-right'
    mouse.currentLecture = newLecture

    // Add the new lecture to the lectures array
    lectures.push(newLecture)

    // Trigger the resize event
    onResizeDown(event, newLecture, true)
  }

  return {
    onCreateMove,
  }
}
