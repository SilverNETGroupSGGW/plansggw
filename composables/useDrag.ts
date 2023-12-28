import type { Lecture } from '~/types'

export default function useDrag(lectures: Lecture[], container: Ref<HTMLElement | null>, groupCells: Ref<HTMLElement[]>) {
  let rafId: number | null = null
  const isDragging = ref(false)
  const currentLecture = ref<Lecture | null>(null)
  const dragStart = ref({ x: 0, y: 0 })

  function onDragDown(event: PointerEvent) {
    isDragging.value = true
    dragStart.value = { x: event.clientX, y: event.clientY }
    currentLecture.value = lectures.find(lecture => lecture.id === Number.parseInt((event.target as HTMLElement).id.split('-')[1]))!

    // Add event listeners to window
    window.addEventListener('pointermove', onDragMove)
    window.addEventListener('pointerup', onDragUp)
  }

  function onDragMove(event: PointerEvent) {
    if (!isDragging.value)
      return

    if (rafId !== null)
      cancelAnimationFrame(rafId)

    if (!currentLecture.value)
      currentLecture.value = lectures.find(lecture => lecture.id === Number.parseInt((event.target as HTMLElement).id.split('-')[1]))!

    rafId = requestAnimationFrame(() => {
      // snap to 48px grid in X axis
      const deltaX = Math.round((event.clientX - dragStart.value.x) / 48) * 48

      // snap to groupCells height in Y axis
      const deltaY = Math.round((event.clientY - dragStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

      if (deltaX !== 0 || deltaY !== 0) {
        const newX = currentLecture.value!.x + deltaX
        const newY = currentLecture.value!.y + deltaY

        // Calculate the total height of groupCells
        const totalHeight = groupCells.value.reduce((sum, cell) => sum + cell.offsetHeight, 0)

        // Set boundaries, x and y can't be smaller than 0
        // newY can't be larger than totalHeight - currentLecture.value!.height
        // newX can't be larger than container.value.offsetWidth - currentLecture.value!.width
        currentLecture.value!.x = newX >= 0 ? (newX <= container.value!.offsetWidth - currentLecture.value!.width ? newX : container.value!.offsetWidth - currentLecture.value!.width) : 0
        currentLecture.value!.y = newY >= 0 ? (newY <= totalHeight - currentLecture.value!.height ? newY : totalHeight - currentLecture.value!.height) : 0

        // Update dragStart based on the actual movement of the element
        dragStart.value = { x: dragStart.value.x + deltaX, y: dragStart.value.y + deltaY }

        currentLecture.value!.overlap = false

        // Check for overlap with other lectures
        for (const lecture of lectures) {
          if (lecture.id !== currentLecture.value!.id) {
            if (newX < lecture.x + lecture.width
              && newX + currentLecture.value!.width > lecture.x
              && newY < lecture.y + lecture.height
              && newY + currentLecture.value!.height > lecture.y) {
              // Overlap detected
              currentLecture.value!.overlap = true
              break
            }
          }
        }
      }
    })
  }

  function onDragUp() {
    isDragging.value = false
    currentLecture.value = null

    // Remove event listeners from window
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragUp)
  }

  return {
    onDragDown,
    onDragMove,
    onDragUp,
  }
}
