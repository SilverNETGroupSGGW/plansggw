<script setup lang="ts">
import type { InteractEvent, ResizeEvent } from '@interactjs/types'
import interact from 'interactjs'
import type { Lecture } from '~/types'

const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

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
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) =>
    `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`)

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
    .on('dragmove', (event: InteractEvent) => {
      const lecture = lectures.find(lecture => `lecture-${lecture.id.toString()}` === event.target.id)!

      const dx = Math.ceil(lecture.left + event.dx)
      const dy = Math.ceil(lecture.top + event.dy)

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

      const dy = Math.round(lecture.top + event.deltaRect!.top)
      const dh = Math.round(Math.ceil((lecture.height + event.deltaRect!.height) / headerHeight.value) * headerHeight.value)
      const dw = Math.round(Math.ceil((lecture.width + event.deltaRect!.width) / 48) * 48)

      lecture.top = dy
      lecture.width = dw
      lecture.height = dh

      if (event.edges?.bottom) {
        if (event.deltaRect!.bottom > 0)
          lecture.group.push(groups.value[groups.value.indexOf(lecture.group[lecture.group.length - 1]) + 1])

        else if (event.deltaRect!.bottom < 0)
          lecture.group.pop()
      }
      else if (event.edges?.top) {
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
  <div class="flex w-full flex-wrap justify-between gap-4 border border-b-gray-200 bg-gray-50 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Kreator planu zajęć<br>
      </h1>
      <p class="text-base font-normal leading-normal text-gray-700">
        Informatyka, semestr 1, rok akademicki 2023/2024
      </p>
    </div>
  </div>

  <div class="relative overflow-x-scroll">
    <div v-for="lecture in lectures" :id="`lecture-${lecture.id?.toString()}`" ref="lectureCells" :key="lecture.id" :style="{ top: `${lecture.top}px`, left: `${lecture.left}px`, width: `${lecture.width}px`, height: `${lecture.height}px` }" class="lecture absolute" :class="getBackgroundClass(lecture)">
      <div class="flex flex-col gap-2 p-4">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-white">{{ lecture.group.join(', ') }}</span>
          <span class="select-none text-xs font-normal text-white">{{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
        </div>
      </div>
    </div>

    <table class="w-full table-fixed border-b border-gray-200">
      <thead>
        <tr>
          <th class="h-12 w-36 border-b border-r border-gray-200 text-center font-semibold text-blue-600">
            Grupa
          </th>
          <th v-for="time in timeRange" :key="time" ref="headers" class="h-[4.5rem] w-36 whitespace-nowrap border-b border-r border-gray-200 text-center font-semibold text-blue-600">
            {{ time }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="border-b">
          <td :id="group" class="h-[4.5rem] w-36 border-r border-gray-200 text-center font-semibold text-blue-600">
            {{ group }}
          </td>
          <td v-for="time in timeRange" :key="time" class="h-[4.5rem] w-36 border-r border-gray-200" :data-group="group" :data-time="time.replaceAll(' ', '').replaceAll(':', '@')" @pointerdown.prevent="onPointerDown" @pointermove.prevent="onPointerMove" @pointerup.prevent="onPointerUp" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
