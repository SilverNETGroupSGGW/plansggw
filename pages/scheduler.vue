<script setup lang="ts">
import type { Lecture } from '~/types'

// State
let rafId: number | null = null
const initialResizeEdge = ref<null | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom'>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const resizeEdge = ref<null | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom'>(null)
const currentLecture = ref<Lecture | null>(null)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })
const dragStart = ref({ x: 0, y: 0 })

// Elements
const container = ref<HTMLDivElement | null>(null)
const groupCells = ref<HTMLDivElement[]>([])

// Lectures
const groups = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const lectures = reactive<Lecture[]>([{
  width: 48,
  height: 131,
  end: new Date(2023, 0, 1, 9, 30, 0, 0),
  start: new Date(2023, 0, 1, 8, 0, 0, 0),
  group: ['1', '2'],
  id: 1,
  x: 0,
  y: 0,
}])
const lectureCells = ref<HTMLDivElement[]>([])

// Time range
const timeRange: Date[] = []
const initialDate = new Date(2023, 0, 1, 8, 0, 0, 0)

while (initialDate.getHours() < 20) {
  timeRange.push(new Date(initialDate.getTime()))
  initialDate.setMinutes(initialDate.getMinutes() + 15)
}

function onDragDown(event: PointerEvent) {
  isDragging.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }

  // Add event listeners to window
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragUp)
}

function onDragMove(event: PointerEvent) {
  if (!isDragging.value)
    return

  if (rafId !== null)
    cancelAnimationFrame(rafId)

  rafId = requestAnimationFrame(() => {
    // snap to 48px grid in X axis
    const deltaX = Math.round((event.clientX - dragStart.value.x) / 48) * 48

    // snap to groupCells height in Y axis
    const deltaY = Math.round((event.clientY - dragStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

    if (deltaX !== 0 || deltaY !== 0) {
      for (const lecture of lectures) {
        const newX = lecture.x + deltaX
        const newY = lecture.y + deltaY

        // Calculate the total height of groupCells
        const totalHeight = groupCells.value.reduce((sum, cell) => sum + cell.offsetHeight, 0)

        // Set boundaries, x and y can't be smaller than 0
        // newY can't be larger than totalHeight - lecture.height
        // newX can't be larger than container.value.offsetWidth - lecture.width
        lecture.x = newX >= 0 ? (newX <= container.value!.offsetWidth - lecture.width ? newX : container.value!.offsetWidth - lecture.width) : 0
        lecture.y = newY >= 0 ? (newY <= totalHeight - lecture.height ? newY : totalHeight - lecture.height) : 0
      }

      // Update dragStart based on the actual movement of the element
      dragStart.value = { x: dragStart.value.x + deltaX, y: dragStart.value.y + deltaY }
    }
  })
}

function onDragUp() {
  isDragging.value = false

  // Remove event listeners from window
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragUp)
}

// Resize
function onPointerDown(event: PointerEvent, lecture: Lecture) {
  // Determine if we're dragging or resizing
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  if (Math.abs(event.clientX - rect.left) < 16 || Math.abs(event.clientX - rect.right) < 16 || Math.abs(event.clientY - rect.top) < 16 || Math.abs(event.clientY - rect.bottom) < 16) {
    // We're resizing
    onResizeDown(event, lecture)
  }
  else {
    // We're dragging
    onDragDown(event)
  }
}

function onResizeDown(event: PointerEvent, lecture: Lecture) {
  isResizing.value = true
  resizeStart.value = { x: event.clientX, y: event.clientY, width: lecture.width, height: lecture.height }
  currentLecture.value = lecture

  // Determine which edge we're resizing
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const nearLeft = Math.abs(event.clientX - rect.left) < 16
  const nearRight = Math.abs(event.clientX - rect.right) < 16
  const nearTop = Math.abs(event.clientY - rect.top) < 16
  const nearBottom = Math.abs(event.clientY - rect.bottom) < 16

  if (nearTop && nearLeft)
    resizeEdge.value = 'top-left'
  else if (nearTop && nearRight)
    resizeEdge.value = 'top-right'
  else if (nearBottom && nearLeft)
    resizeEdge.value = 'bottom-left'
  else if (nearBottom && nearRight)
    resizeEdge.value = 'bottom-right'
  else if (nearLeft)
    resizeEdge.value = 'left'
  else if (nearRight)
    resizeEdge.value = 'right'
  else if (nearTop)
    resizeEdge.value = 'top'
  else if (nearBottom)
    resizeEdge.value = 'bottom'

  // Store the initial resize direction
  initialResizeEdge.value = resizeEdge.value

  // Add event listeners to window
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeUp)
}

function onResizeMove(event: PointerEvent) {
  if (!isResizing.value || !currentLecture.value)
    return

  if (rafId !== null)
    cancelAnimationFrame(rafId)

  rafId = requestAnimationFrame(() => {
    const deltaX = Math.round((event.clientX - resizeStart.value.x) / 48) * 48
    const deltaY = Math.round((event.clientY - resizeStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight
    let newWidth, newHeight, newX, newY

    const totalHeight = groupCells.value.reduce((sum, cell) => sum + cell.offsetHeight, 0)
    const minCellHeight = groupCells.value[0].offsetHeight // Assuming all cells have the same height

    switch (initialResizeEdge.value) {
      case 'top-left':
        newWidth = Math.max(0, resizeStart.value.width - deltaX)
        newX = Math.max(0, currentLecture.value!.x + (currentLecture.value!.width - newWidth))
        newHeight = Math.max(0, resizeStart.value.height - deltaY)
        newY = Math.max(0, currentLecture.value!.y + (currentLecture.value!.height - newHeight))
        if (newX !== 0)
          currentLecture.value!.width = newWidth
        if (newY !== 0)
          currentLecture.value!.height = newHeight
        currentLecture.value!.x = newX
        currentLecture.value!.y = newY
        break
      case 'top-right':
        newWidth = Math.max(0, resizeStart.value.width + deltaX)
        newHeight = Math.max(minCellHeight, resizeStart.value.height - deltaY) // Set the minimum height to minCellHeight
        newY = Math.max(0, currentLecture.value!.y + (currentLecture.value!.height - newHeight))
        currentLecture.value!.width = newWidth
        if (newY !== 0)
          currentLecture.value!.height = newHeight
        currentLecture.value!.y = newY
        break
      case 'bottom-left':
        newWidth = Math.max(0, resizeStart.value.width - deltaX)
        newX = Math.max(0, currentLecture.value!.x + (currentLecture.value!.width - newWidth))
        newHeight = Math.max(0, resizeStart.value.height + deltaY)
        if (newX !== 0)
          currentLecture.value!.width = newWidth
        currentLecture.value!.height = newHeight
        currentLecture.value!.x = newX
        break
      case 'bottom-right':
        newWidth = Math.min(container.value!.offsetWidth, Math.max(0, resizeStart.value.width + deltaX)) // Set the maximum width to container.value.offsetWidth
        newHeight = Math.min(totalHeight, Math.max(minCellHeight, resizeStart.value.height + deltaY)) // Set the minimum height to minCellHeight and maximum height to totalHeight
        currentLecture.value!.width = newWidth
        currentLecture.value!.height = newHeight
        break
      case 'left':
        newWidth = Math.max(0, resizeStart.value.width - deltaX)
        newX = Math.max(0, currentLecture.value!.x + (currentLecture.value!.width - newWidth))
        if (newX !== 0)
          currentLecture.value!.width = newWidth
        currentLecture.value!.x = newX
        break
      case 'right':
        newWidth = Math.min(container.value!.offsetWidth, Math.max(0, resizeStart.value.width + deltaX)) // Set the maximum width to container.value.offsetWidth
        currentLecture.value!.width = newWidth
        break
      case 'top':
        newHeight = Math.max(minCellHeight, resizeStart.value.height - deltaY) // Set the minimum height to minCellHeight
        newY = Math.max(0, currentLecture.value!.y + (currentLecture.value!.height - newHeight))
        if (newY !== 0)
          currentLecture.value!.height = newHeight
        currentLecture.value!.y = newY
        break
      case 'bottom':
        newHeight = Math.min(totalHeight, Math.max(minCellHeight, resizeStart.value.height + deltaY)) // Set the minimum height to minCellHeight and maximum height to totalHeight
        currentLecture.value!.height = newHeight
        break
    }
  })
}

function onResizeUp() {
  isResizing.value = false
  currentLecture.value = null

  // Remove event listeners from window
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', onResizeUp)

  initialResizeEdge.value = null
}
</script>

<template>
  <div class="h-full overflow-x-scroll">
    <div class="flex w-full flex-col">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex h-12 w-[7.5rem] shrink-0" />
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap text-center font-medium text-gray-700">
            <div>{{ time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
          </div>
        </div>

        <div class="flex">
          <div class="flex h-12 w-36 shrink-0 border-r" />
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap border-b border-r border-gray-200 text-center font-medium text-gray-700" />
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-175px)]">
      <div class="flex h-full w-fit flex-col">
        <div v-for="group in groups" v-once :id="group" ref="groupCells" :key="group" :style="{ height: `${100 / groups.length}%` }" class="flex w-36 shrink-0 items-center justify-center border-r border-t border-gray-200 text-center text-xs text-gray-700">
          {{ group }}
        </div>
      </div>

      <div ref="container" class="relative flex flex-col">
        <div
          :id="`lecture-${lectures[0].id?.toString()}`"
          ref="lectureCells"
          :style="{ transform: `translate(${lectures[0].x}px, ${lectures[0].y}px)`, width: `${lectures[0].width}px`, height: `${lectures[0].height}px` }"
          class="absolute pb-0.5 pr-0.5 hover:cursor-move"
          @pointerdown.prevent="onPointerDown($event, lectures[0])"
        >
          <div class="flex h-full flex-col gap-2 rounded-md bg-blue-700 p-4" :class="[{ 'opacity-50': lectures[0].ghost, 'z-[1]': !lectures[0].ghost }]">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-semibold text-white">{{ lectures[0].group.join(', ') }}</span>
              <span class="select-none text-xs font-normal text-white">{{ lectures[0].start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lectures[0].end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
            </div>
          </div>
        </div>

        <div v-for="group in groups" v-once :key="group" class="flex" :style="{ height: `${100 / groups.length}%` }">
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-full w-36 shrink-0 items-center justify-between border-b border-r border-gray-200 text-center text-xs text-gray-700" :data-group="group" :data-time="time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })" />
        </div>
      </div>
    </div>
  </div>
</template>
