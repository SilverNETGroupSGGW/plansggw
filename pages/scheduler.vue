<script setup lang="ts">
import type { InteractEvent, ResizeEvent } from '@interactjs/types'
import interact from 'interactjs'
import type { Lecture } from '~/types'

const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

// Cells
const headers = ref<HTMLTableCellElement[]>([])
const headerWidth = ref(0) // constant

// Time range
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) =>
    `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`)

// Lectures
const groups = ref(['ISI-1', 'ISI-2', 'ISK', 'TM'])
const lectures = reactive<Lecture[]>([])
const lectureCells = ref<HTMLDivElement[]>([])
const { onPointerDown, onPointerMove, onPointerUp } = useMouse(lectures)

onMounted(() => {
  // Set header width
  headerWidth.value = headers.value[0].offsetWidth

  // Apply interact.js
  const _interact = interact('.lecture')
    .draggable({
      origin: 'parent',
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: headerWidth.value, y: 16 }),
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

      if (event.delta.x > 0) {
        lecture.group.push(groups.value[groups.value.indexOf(lecture.group[lecture.group.length - 1]) + 1])
        lecture.group.shift()
      }
      else if (event.delta.x < 0) {
        lecture.group.unshift(groups.value[groups.value.indexOf(lecture.group[0]) - 1])
        lecture.group.pop()
      }

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.top / 16 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.height / 16 * 5 * 60 * 1000))
    })
    .resizable({
      origin: 'parent',
      edges: { top: true, bottom: true, left: true, right: true },
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: headerWidth.value, y: 16 }),
          ],
          range: Number.POSITIVE_INFINITY,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
    })
    .on('resizemove', (event: ResizeEvent) => {
      const lecture = lectures.find(lecture => `lecture-${lecture.id.toString()}` === event.target.id)!

      const dy = Math.round(lecture.top + event.deltaRect!.top)
      const dh = Math.round(Math.ceil((lecture.height + event.deltaRect!.height) / 16) * 16)

      lecture.top = dy
      lecture.height = dh

      if (event.edges?.right) {
        lecture.width += event.deltaRect!.right

        if (event.deltaRect!.right > 0)
          lecture.group.push(groups.value[groups.value.indexOf(lecture.group[lecture.group.length - 1]) + 1])

        else if (event.deltaRect!.right < 0)
          lecture.group.pop()
      }
      else if (event.edges?.left) {
        lecture.width -= event.deltaRect!.left
        lecture.left += event.deltaRect!.left

        if (event.deltaRect!.left > 0)
          lecture.group.shift()

        else if (event.deltaRect!.left < 0)
          lecture.group.push(groups.value[groups.value.indexOf(lecture.group[0]) - 1])
      }

      lecture.group.sort()

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.top / 16 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.height / 16 * 5 * 60 * 1000))
    })

  // Watch window size changes
  window.addEventListener('resize', () => {
    const _headerWidth = headers.value[0].offsetWidth
    _interact.draggable({ modifiers: [interact.modifiers.snap({ targets: [interact.snappers.grid({ x: _headerWidth, y: 16 })], range: Number.POSITIVE_INFINITY, relativePoints: [{ x: 0, y: 0 }] })] })
    _interact.resizable({ modifiers: [interact.modifiers.snap({ targets: [interact.snappers.grid({ x: _headerWidth, y: 16 })], range: Number.POSITIVE_INFINITY, relativePoints: [{ x: 0, y: 0 }] })] })

    lectures.forEach((lecture) => {
      lecture.width = _headerWidth * lecture.group.length
      lecture.left = _headerWidth * (groups.value.indexOf(lecture.group[0]) + 1)
    })
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
    <div v-for="lecture in lectures" :id="`lecture-${lecture.id?.toString()}`" ref="lectureCells" :key="lecture.id" :style="{ top: `${lecture.top}px`, left: `${lecture.left}px`, width: `${lecture.width}px`, height: `${lecture.height}px` }" class="lecture absolute z-10 box-border bg-blue-600">
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
          <th class="h-12 border-b border-r border-gray-200 px-12 text-left font-semibold text-blue-600">
            Grupa
          </th>
          <th v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" ref="headers" :key="group" class="h-12 whitespace-nowrap border-b border-r border-gray-200 px-12 text-center font-semibold text-blue-600">
            {{ group }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="time in timeRange" :key="time" class="border-b">
          <td :id="time.replaceAll(' ', '').replaceAll(':', '@')" class="h-12 border-r border-gray-200 px-12 text-left font-semibold text-blue-600">
            {{ time }}
          </td>
          <td v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="h-12 border-r border-gray-200 px-12" :data-group="group" :data-time="time.replaceAll(' ', '').replaceAll(':', '@')" @pointerdown.prevent="onPointerDown" @pointermove.prevent="onPointerMove" @pointerup.prevent="onPointerUp" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
