<script setup lang="ts">
import interact from 'interactjs'
import type { Lecture } from '~/types'

const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

onMounted(() => {
  interact('#lecture')
    .resizable({
      edges: { bottom: true },
      listeners: {
        move(event) {
          let { x, y } = event.target.dataset

          x = (Number.parseFloat(x) || 0) + event.deltaRect.left
          y = (Number.parseFloat(y) || 0) + event.deltaRect.top

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${Math.round(event.rect.height / 12) * 12}px`,
            transform: `translate(${x}px, ${y}px)`,
          })

          Object.assign(event.target.dataset, { x, y })
        },
      },
    })
})

// Cells
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) =>
    `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`)

// Lectures
const lectures = ref<Lecture[]>([])
const { onPointerDown, onPointerMove, onPointerUp } = useMouse(lectures)
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
    <div v-for="lecture in lectures" id="lecture" :key="lecture.startCell.id" :style="{ top: `${lecture.startCell.offsetTop}px`, left: `${lecture.startCell.offsetLeft}px`, width: `${lecture.endCell.offsetLeft - lecture.startCell.offsetLeft + lecture.endCell.offsetWidth}px`, height: `${lecture.endCell.offsetTop - lecture.startCell.offsetTop + lecture.endCell.offsetHeight}px` }" class="absolute z-10 bg-blue-600">
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
          <th class="border-b border-r border-gray-200 px-12 py-4 text-left font-semibold text-blue-600">
            Grupa
          </th>
          <th v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="whitespace-nowrap border-b border-r border-gray-200 px-12 py-4 text-center font-semibold text-blue-600">
            {{ group }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="time in timeRange" :key="time" class="border-b">
          <td :id="time.replaceAll(' ', '').replaceAll(':', '@')" class="h-6 border-r border-gray-200 px-12 text-left font-semibold text-blue-600">
            {{ time }}
          </td>
          <td v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="h-9 border-r border-gray-200 px-12" :data-group="group" :data-time="time.replaceAll(' ', '').replaceAll(':', '@')" @pointerdown.prevent="onPointerDown" @pointermove.prevent="onPointerMove" @pointerup.prevent="onPointerUp" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
