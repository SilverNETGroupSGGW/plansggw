<script setup lang="ts">
import Moveable from 'vue3-moveable'

const { chunk } = useArray()
const { generateTimeInterval } = useTime()

const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) => [
    start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  ])
  .map(([start, end]) => `${start} - ${end}`)

const target = ref<HTMLDivElement | null>(null)
const moveable = ref(null)

function onDrag(e) {
  e.target.style.transform = e.transform
}

function onResize(e) {
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  e.target.style.transform = e.drag.transform
}

function generateIds(groups: string[], times: string[]) {
  // ISI-1, ISI-2, ISI-3, ISI-4
  // 8:45 - 9:00, ...
  // return ISI_1_08:45___09:00
  const result: string[] = []
  for (const group of groups) {
    for (const time of times) {
      const id = `#${group.replace('-', '_')}_${time.replaceAll(' ', '_').replaceAll('-', '_').replaceAll(':', '_')}`
      result.push(id)
    }
  }

  return result.map(x => ({ element: x, className: 'hidden' }))
}
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


  <div ref="target" class="absolute left-1/2 top-1/2 h-[88.8px] w-[188.36px] bg-red-500" />
    <Moveable :target="target" :draggable="true" :throttle-drag="1" :edge-draggable="false" :start-drag-rotate="0" :throttle-drag-rotate="0" :resizable="true" :snappable="true" :element-guidelines="generateIds(['ISI-1', 'ISI-2', 'ISK', 'TM'], timeRange)" :moveable="true" :hide-default-lines="true" @drag="onDrag" :is-display-snap-digit="false" @resize="onResize" :isDisplayInnerSnapDigit="false" />


  <div class="overflow-x-scroll">
    <table class="w-full table-auto border-b border-gray-200">
      <thead>
        <tr>
          <th class="border-b border-r border-gray-200 px-12 py-4 text-left font-semibold text-blue-600">
            Grupa
          </th>
          <th v-for="time in timeRange" :key="time" class="whitespace-nowrap border-b border-r border-gray-200 px-12 py-4 text-center font-semibold text-blue-600">
            {{ time }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="border-b">
          <td :id="group.replace('-', '_')" class="border-r border-gray-200 px-12 py-8 text-left font-semibold text-blue-600">
            {{ group }}
          </td>
          <td v-for="time in timeRange" :id="`${group}-${time}`.replaceAll(' ', '_').replaceAll('-', '_').replaceAll(':', '_')" :key="time" class="border-r border-gray-200" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
