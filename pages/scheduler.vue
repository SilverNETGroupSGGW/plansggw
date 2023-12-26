<script setup lang="ts">
import type { Lecture } from '~/types'

// State
const isDragging = ref(false)

// Cells
const groupCells = ref<HTMLDivElement[]>([])
const groups = ref(['ISI-1', 'ISI-2', 'ISK', 'TM'])

function getBackgroundClass(lecture: Lecture) {
  switch (lecture.group[0]) {
    case 'ISI-1':
      return 'bg-blue-600'
    case 'ISI-2':
      return 'bg-green-600'
    case 'ISK':
      return 'bg-yellow-600'
    case 'TM':
      return 'bg-red-600'
  }
}

// Time range
const timeRange: Date[] = []

// 8:00 to 20:00 in 15 minutes interval
for (let i = 0; i < 48; i++)
  timeRange.push(new Date(new Date(2023, 0, 1, 8, 0, 0, 0).getTime() + (i * 15 * 60 * 1000)))

// Lectures
const lectures = reactive<Lecture[]>([])
const lectureCells = ref<HTMLDivElement[]>([])
const { onPointerDown, onPointerMove, onPointerUp } = useMouse(lectures)

// Drag
const dragStart = ref({ x: 0, y: 0 })

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

  // snap to 48px grid in X axis
  const deltaX = Math.round((event.clientX - dragStart.value.x) / 48) * 48

  // snap to groupCells height in Y axis
  const deltaY = Math.round((event.clientY - dragStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

  if (deltaX !== 0 || deltaY !== 0) {
    for (const lecture of lectures) {
      lecture.left += deltaX
      lecture.top += deltaY
    }

    // Update dragStart based on the actual movement of the element
    dragStart.value = { x: dragStart.value.x + deltaX, y: dragStart.value.y + deltaY }
  }
}

function onDragUp() {
  isDragging.value = false

  // Remove event listeners from window
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragUp)
}

// State
const isResizing = ref(false)
const resizeEdge = ref('')

// Resize
const currentLecture = ref<Lecture | null>(null)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

function _onPointerDown(event: PointerEvent, lecture: Lecture) {
  // Determine if we're dragging or resizing
  const rect = event.target.getBoundingClientRect()
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
  const rect = event.target.getBoundingClientRect()
  if (Math.abs(event.clientX - rect.left) < 16)
    resizeEdge.value = 'left'
  else if (Math.abs(event.clientX - rect.right) < 16)
    resizeEdge.value = 'right'
  else if (Math.abs(event.clientY - rect.top) < 16)
    resizeEdge.value = 'top'
  else if (Math.abs(event.clientY - rect.bottom) < 16)
    resizeEdge.value = 'bottom'

  // Add event listeners to window
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeUp)
}

function onResizeMove(event: PointerEvent) {
  if (!isResizing.value || !currentLecture.value)
    return

  if (resizeEdge.value === 'left') {
    const deltaX = Math.round((event.clientX - resizeStart.value.x) / 48) * 48
    const newWidth = resizeStart.value.width - deltaX
    currentLecture.value.left = currentLecture.value.left + (currentLecture.value.width - newWidth)
    currentLecture.value.width = newWidth
  }
  else if (resizeEdge.value === 'right') {
    const deltaX = Math.round((event.clientX - resizeStart.value.x) / 48) * 48
    currentLecture.value.width = resizeStart.value.width + deltaX
  }
  else if (resizeEdge.value === 'top') {
    const deltaY = Math.round((event.clientY - resizeStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight
    const newHeight = resizeStart.value.height - deltaY
    currentLecture.value.top = currentLecture.value.top + (currentLecture.value.height - newHeight)
    currentLecture.value.height = newHeight
  }
  else if (resizeEdge.value === 'bottom') {
    const deltaY = Math.round((event.clientY - resizeStart.value.y) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight
    currentLecture.value.height = resizeStart.value.height + deltaY
  }
}

function onResizeUp() {
  isResizing.value = false
  currentLecture.value = null

  // Remove event listeners from window
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', onResizeUp)
}
</script>

<template>
  <div class="h-full overflow-x-scroll">
    <div class="flex w-full flex-col">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex h-12 w-[7.5rem] shrink-0" />
          <div v-for="(time, index) in timeRange" :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap text-center font-medium text-gray-700">
            <div>{{ time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
          </div>
        </div>

        <div class="flex">
          <div class="flex h-12 w-36 shrink-0 border-r" />
          <div v-for="(time, index) in timeRange" :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap border-b border-r border-gray-200 text-center font-medium text-gray-700" />
        </div>
      </div>
    </div>

    <!-- here -->
    <div class="flex h-[calc(100vh-175px)]">
      <div class="flex h-full w-fit flex-col">
        <div v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :id="group" ref="groupCells" :key="group" class="flex h-[calc(100%/4)] w-36 shrink-0 items-center justify-center border-r border-t border-gray-200 text-center text-xs text-gray-700">
          {{ group }}
        </div>
      </div>

      <div class="relative flex flex-col">
        <div
          v-for="lecture in lectures"
          :id="`lecture-${lecture.id?.toString()}`"
          ref="lectureCells"
          :key="lecture.id"
          :style="{ top: `${lecture.top}px`, left: `${lecture.left}px`, width: `${lecture.width}px`, height: `${lecture.height}px` }"
          class="absolute pb-0.5 pr-0.5 hover:cursor-move"
          @pointerdown.prevent="_onPointerDown($event, lecture)"
        >
          <div class="flex h-full flex-col gap-2 rounded-md p-4" :class="[getBackgroundClass(lecture), { 'opacity-50': lecture.ghost, 'z-[1]': !lecture.ghost }]">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-semibold text-white">{{ lecture.group.join(', ') }}</span>
              <span class="select-none text-xs font-normal text-white">{{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
            </div>
          </div>
        </div>

        <div v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="flex h-1/4">
          <div v-for="(time, index) in timeRange" :key="index" class="flex h-full w-36 shrink-0 items-center justify-between border-b border-r border-gray-200 text-center text-xs text-gray-700" :data-group="group" :data-time="time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })" @pointerdown.prevent="onPointerDown" @pointermove.prevent="onPointerMove" @pointerup.prevent="onPointerUp" />
        </div>
      </div>
    </div>
  </div>
</template>
