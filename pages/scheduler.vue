<script setup lang="ts">
import type { InteractEvent, ResizeEvent } from '@interactjs/types'
import interact from 'interactjs'
import type { Lecture } from '~/types'

// State
const isDragging = ref(false)

// Cells
const groups = ref(['ISI-1', 'ISI-2', 'ISK', 'TM'])

const headers = ref<HTMLTableCellElement[]>([])
const headerHeight = ref(0) // constant

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

onMounted(() => {
  // Set header height
  headerHeight.value = headers.value[0].offsetHeight

  // Apply interact.js
  const _interact = interact('.lecture')
    .draggable({
      origin: 'parent',
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: 48, y: headerHeight.value }),
          ],
          range: Number.POSITIVE_INFINITY,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      inertia: false,
    })
    .on('dragstart', (event: InteractEvent) => {
      const lecture = lectures.find(lecture => `lecture-${lecture.id.toString()}` === event.target.id)!

      if (!isDragging.value) {
        isDragging.value = true
        lectures.push({
          ...lecture,
          id: `ghost-${lecture.id}`,
          group: [...lecture.group],
          start: new Date(lecture.start),
          end: new Date(lecture.end),
          ghost: true,
        })
      }
    })
    .on('dragmove', (event: InteractEvent) => {
      const lecture = lectures.find(lecture => `lecture-${lecture.id.toString()}` === event.target.id)!

      const dx = Math.ceil((lecture.left + event.dx) / 48) * 48
      const dy = Math.ceil(lecture.top + event.dy)

      if (dx < 0 || dy < 0)
        return

      lecture.left = dx
      lecture.top = dy

      if (event.delta.y > 0) {
        lecture.group.push(groups.value[groups.value.indexOf(lecture.group[lecture.group.length - 1]) + 1])
        lecture.group.shift()
      }
      else if (event.delta.y < 0) {
        lecture.group.unshift(groups.value[groups.value.indexOf(lecture.group[0]) - 1])
        lecture.group.pop()
      }

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.left / 48 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.width / 48 * 5 * 60 * 1000))
    })
    .on('dragend', () => {
      isDragging.value = false
      lectures.splice(lectures.findIndex(lecture => lecture.ghost), 1)
    })
    .resizable({
      origin: 'parent',
      edges: { top: true, bottom: true, left: true, right: true },
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: 48, y: headerHeight.value }),
          ],
          range: Number.POSITIVE_INFINITY,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
    })
    .on('resizemove', (event: ResizeEvent) => {
      const lecture = lectures.find(lecture => `lecture-${lecture.id.toString()}` === event.target.id)!

      const dx = Math.ceil((lecture.left + event.deltaRect!.left) / 48) * 48
      const dw = Math.round(Math.ceil((lecture.width + event.deltaRect!.width) / 48) * 48)

      if (dx < 0)
        return

      lecture.left = dx
      lecture.width = dw

      if (event.edges?.bottom) {
        lecture.height += event.deltaRect!.bottom

        if (event.deltaRect!.bottom > 0)
          lecture.group.push(groups.value[groups.value.indexOf(lecture.group[lecture.group.length - 1]) + 1])

        else if (event.deltaRect!.bottom < 0)
          lecture.group.pop()
      }
      else if (event.edges?.top) {
        const top = event.deltaRect!.top
        if (top < 0)
          return

        lecture.height -= event.deltaRect!.top
        lecture.top += top

        if (event.deltaRect!.top < 0)
          lecture.group.unshift(groups.value[groups.value.indexOf(lecture.group[0]) - 1])
        else if (event.deltaRect!.top > 0)
          lecture.group.shift()
      }

      lecture.group.sort()

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.left / 48 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.width / 48 * 5 * 60 * 1000))
    })

  // Watch window size changes
  window.addEventListener('resize', () => {
    const _headerHeight = headers.value[0].offsetHeight
    _interact.draggable({ modifiers: [interact.modifiers.snap({ targets: [interact.snappers.grid({ x: 48, y: _headerHeight })], range: Number.POSITIVE_INFINITY, relativePoints: [{ x: 0, y: 0 }] })] })
    _interact.resizable({ modifiers: [interact.modifiers.snap({ targets: [interact.snappers.grid({ x: 48, y: _headerHeight })], range: Number.POSITIVE_INFINITY, relativePoints: [{ x: 0, y: 0 }] })] })
  })
})
</script>

<template>
  <div class="h-full overflow-x-scroll">
    <div class="flex w-full flex-col">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex h-12 w-[7.5rem] shrink-0" />
          <div v-for="(time, index) in timeRange" :key="index" ref="headers" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap text-center font-medium text-gray-700">
            <div>{{ time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
          </div>
        </div>

        <div class="flex">
          <div class="flex h-12 w-36 shrink-0 border-r" />
          <div v-for="(time, index) in timeRange" :key="index" ref="headers" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap border-b border-r border-gray-200 text-center font-medium text-gray-700" />
        </div>
      </div>

      <!-- <div class="flex h-full flex-col">
        <div v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="flex h-full">
          <div :id="group" class="flex h-full w-36 shrink-0 items-center justify-center border-r border-t border-gray-200 text-center text-xs text-gray-700">
            {{ group }}
          </div>
          <div v-for="(time, index) in timeRange" :key="index" class="flex h-full w-36 shrink-0 items-center justify-between border-b border-r border-gray-200 text-center text-xs text-gray-700" />
        </div>
      </div> -->
    </div>

    <!-- here -->
    <div class="flex h-[calc(100vh-175px)]">
      <div class="flex h-full w-fit flex-col">
        <div v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :id="group" :key="group" ref="headers" class="flex h-[calc(100%/4)] w-36 shrink-0 items-center justify-center border-r border-t border-gray-200 text-center text-xs text-gray-700">
          {{ group }}
        </div>
      </div>

      <div class="relative flex flex-col">
        <div v-for="lecture in lectures" :id="`lecture-${lecture.id?.toString()}`" ref="lectureCells" :key="lecture.id" :style="{ top: `${lecture.top}px`, left: `${lecture.left}px`, width: `${lecture.width}px`, height: `${lecture.height}px` }" class="lecture absolute pb-0.5 pr-0.5">
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
