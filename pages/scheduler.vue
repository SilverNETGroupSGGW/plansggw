<script setup lang="ts">
import type { InteractEvent, ResizeEvent } from '@interactjs/types'
import interact from 'interactjs'
import type { Lecture } from '~/types'

const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

// Cells
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) =>
    `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`)

// Lectures
const lectures = reactive<Lecture[]>([])
const lectureCells = reactive<HTMLDivElement[]>([])
const { onPointerDown, onPointerMove, onPointerUp } = useMouse(lectures)

// Watch lectures value
watch(lectureCells, () => {
  interact(lectureCells.at(-1)!)
    .draggable({
      origin: 'parent',
      lockAxis: 'y',
      startAxis: 'y',
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: 16, y: 16 }),
          ],
          range: Number.POSITIVE_INFINITY,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      inertia: true,
    })
    .on('dragmove', (event: InteractEvent) => {
      const lecture = lectures.at(-1)!
      const dy = Math.ceil(lecture.top + event.dy)

      lecture.top = dy

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.top / 16 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.height / 16 * 5 * 60 * 1000))
    })
    .resizable({
      origin: 'parent',
      edges: { bottom: true },
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ x: 16, y: 16 }),
          ],
          range: Number.POSITIVE_INFINITY,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      inertia: true,
    })
    .on('resizemove', (event: ResizeEvent) => {
      const lecture = lectures.at(-1)!
      const dy = Math.ceil(lecture.top + event.deltaRect!.top)
      const dh = Math.ceil(lecture.height + event.deltaRect!.height)

      lecture.top = dy
      lecture.height = dh

      lecture.start = new Date(new Date(2023, 0, 1, 7, 45, 0, 0).getTime() + (lecture.top / 16 * 5 * 60 * 1000))
      lecture.end = new Date(lecture.start.getTime() + (lecture.height / 16 * 5 * 60 * 1000))
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
    <div v-for="lecture in lectures" id="lecture" ref="lectureCells" :key="lecture.id" :style="{ top: `${lecture.top}px`, left: `${lecture.left}px`, width: `${lecture.width}px`, height: `${lecture.height}px` }" class="absolute z-10 box-border bg-blue-600">
      <div class="flex flex-col gap-2 p-4">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-white">{{ lecture.group }}</span>
          <span class="text-xs font-normal text-white">{{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
        </div>
      </div>
    </div>

    <table class="w-full table-fixed border-b border-gray-200">
      <thead>
        <tr>
          <th class="h-12 border-b border-r border-gray-200 px-12 text-left font-semibold text-blue-600">
            Grupa
          </th>
          <th v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="h-12 whitespace-nowrap border-b border-r border-gray-200 px-12 text-center font-semibold text-blue-600">
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
