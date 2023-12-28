import type { Lecture } from '~/types'

export default function useResize(lectures: Lecture[], container: Ref<HTMLElement | null>, groupCells: Ref<HTMLElement[]>) {
  const mouse = useMouse()

  const { onDragDown } = useDrag(lectures, container, groupCells)

  let rafId: number | null = null
  const initialResizeEdge = ref<null | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom'>(null)
  const isCreating = ref(false)
  const isResizing = ref(false)
  const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

  function onPointerDown(event: PointerEvent, lecture: Lecture) {
    if (event.button !== 0)
      return

    // Determine if we're dragging or resizing
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    if (Math.abs(event.clientX - rect.left) < 16 || Math.abs(event.clientX - rect.right) < 16 || Math.abs(event.clientY - rect.top) < 16 || Math.abs(event.clientY - rect.bottom) < 16) {
      // We're resizing
      onResizeDown(event, lecture, false)
    }
    else {
      // We're dragging
      onDragDown(event)
    }
  }

  function onResizeDown(event: PointerEvent, lecture: Lecture, isCreating: boolean) {
    isResizing.value = true
    resizeStart.value = { x: event.clientX, y: event.clientY, width: lecture.width, height: lecture.height }
    mouse.currentLecture = lecture

    if (!isCreating) {
      // Determine which edge we're resizing
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const nearLeft = Math.abs(event.clientX - rect.left) < 16
      const nearRight = Math.abs(event.clientX - rect.right) < 16
      const nearTop = Math.abs(event.clientY - rect.top) < 16
      const nearBottom = Math.abs(event.clientY - rect.bottom) < 16

      if (nearTop && nearLeft)
        mouse.resizeEdge = 'top-left'
      else if (nearTop && nearRight)
        mouse.resizeEdge = 'top-right'
      else if (nearBottom && nearLeft)
        mouse.resizeEdge = 'bottom-left'
      else if (nearBottom && nearRight)
        mouse.resizeEdge = 'bottom-right'
      else if (nearLeft)
        mouse.resizeEdge = 'left'
      else if (nearRight)
        mouse.resizeEdge = 'right'
      else if (nearTop)
        mouse.resizeEdge = 'top'
      else if (nearBottom)
        mouse.resizeEdge = 'bottom'
    }

    // Store the initial resize direction
    initialResizeEdge.value = mouse.resizeEdge

    // Add event listeners to window
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeUp)
  }

  function onResizeMove(event: PointerEvent) {
    // Early return if not resizing or no current lecture
    if (!isResizing.value || !mouse.currentLecture)
      return

    // Cancel any existing animation frame request
    if (rafId !== null)
      cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      // Calculate the change in x and y positions
      const deltaX = Math.round((event.clientX - resizeStart.value.x) / 48) * 48
      const deltaY = Math.round((event.clientY - resizeStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

      let newWidth, newHeight, newX, newY

      // Calculate the total height of the group cells
      const totalHeight = groupCells.value.reduce((sum, cell) => sum + cell.offsetHeight, 0)
      const minCellHeight = groupCells.value[0].offsetHeight // Assuming all cells have the same height

      switch (initialResizeEdge.value) {
        case 'top-left':
          newWidth = Math.max(0, resizeStart.value.width - deltaX)
          newX = mouse.currentLecture!.x + (mouse.currentLecture!.width - newWidth)
          newHeight = Math.max(0, resizeStart.value.height - deltaY)
          newY = mouse.currentLecture!.y + (mouse.currentLecture!.height - newHeight)
          if (newX >= 0 && newY >= 0) {
            mouse.currentLecture!.width = newWidth
            mouse.currentLecture!.height = newHeight
            mouse.currentLecture!.x = newX
            mouse.currentLecture!.y = newY
          }
          break
        case 'top-right':
          newWidth = Math.max(0, resizeStart.value.width + deltaX)
          newHeight = Math.max(minCellHeight, resizeStart.value.height - deltaY)
          newY = mouse.currentLecture!.y + (mouse.currentLecture!.height - newHeight)
          mouse.currentLecture!.width = newWidth
          if (newY >= 0) {
            mouse.currentLecture!.height = newHeight
            mouse.currentLecture!.y = newY
          }
          break
        case 'bottom-left':
          newWidth = Math.max(0, resizeStart.value.width - deltaX)
          newX = mouse.currentLecture!.x + (mouse.currentLecture!.width - newWidth)
          newHeight = Math.max(0, resizeStart.value.height + deltaY)
          if (newX >= 0 && newX + newWidth <= container.value!.offsetWidth) {
            mouse.currentLecture!.width = newWidth
            mouse.currentLecture!.x = newX
          }
          if (mouse.currentLecture!.y + newHeight <= totalHeight)
            mouse.currentLecture!.height = newHeight

          break
        case 'bottom-right':
          newWidth = Math.max(0, resizeStart.value.width + deltaX)
          newHeight = Math.max(0, resizeStart.value.height + deltaY)
          if (mouse.currentLecture!.x + newWidth <= container.value!.offsetWidth)
            mouse.currentLecture!.width = newWidth

          if (mouse.currentLecture!.y + newHeight <= totalHeight)
            mouse.currentLecture!.height = newHeight

          break
        case 'left':
          newWidth = Math.max(0, resizeStart.value.width - deltaX)
          newX = mouse.currentLecture!.x + (mouse.currentLecture!.width - newWidth)
          if (newX >= 0) {
            mouse.currentLecture!.width = newWidth
            mouse.currentLecture!.x = newX
          }
          break
        case 'right':
          newWidth = Math.min(container.value!.offsetWidth - mouse.currentLecture!.x, Math.max(0, resizeStart.value.width + deltaX))
          mouse.currentLecture!.width = newWidth
          break
        case 'top':
          newHeight = Math.max(minCellHeight, resizeStart.value.height - deltaY)
          newY = mouse.currentLecture!.y + (mouse.currentLecture!.height - newHeight)
          if (newY >= 0) {
            mouse.currentLecture!.height = newHeight
            mouse.currentLecture!.y = newY
          }
          break
        case 'bottom':
          newHeight = Math.min(totalHeight - mouse.currentLecture!.y, Math.max(minCellHeight, resizeStart.value.height + deltaY))
          mouse.currentLecture!.height = newHeight
          break
      }
    })
  }

  function onResizeUp() {
    isResizing.value = false
    isCreating.value = false
    // Drop the ghost class
    mouse.currentLecture!.ghost = false
    mouse.currentLecture = null

    // Remove event listeners from window
    window.removeEventListener('pointermove', onResizeMove)
    window.removeEventListener('pointerup', onResizeUp)

    initialResizeEdge.value = null
  }

  return {
    onPointerDown,
    onResizeDown,
    onResizeMove,
    onResizeUp,
  }
}
