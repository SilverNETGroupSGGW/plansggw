<script setup lang="ts">
const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

// Interfaces
interface Lecture {
  startCell: HTMLTableCellElement
  endCell: HTMLTableCellElement

  start: Date
  end: Date
  group: string
}

// Misc
function parseTime(time: string) {
  const [hour, minute] = time.split(':').map(Number)
  return (hour - 1) * 60 * 60 * 1000 + minute * 60 * 1000
}

// Cells
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) => {
    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    return `${startStr} - ${endStr}`
  })

// Mouse events
const lectures = ref<Lecture[]>([])
const isDragging = ref(false)
const millis = {
  start: 0,
  end: 0,
}
let currentGroup: string | null = null

function onMouseDown(event: MouseEvent) {
  if (event.button !== 0)
    return

  isDragging.value = true
}

function onMouseUp(event: MouseEvent) {
  if (event.button !== 0)
    return

  isDragging.value = false

  if (millis.start !== 0 && millis.end !== 0 && currentGroup !== null) {
    const data = {
      start: new Date(millis.start),
      end: new Date(millis.end),
      group: currentGroup,
    } as Lecture

    lectures.value.push(data)
  }

  millis.start = 0
  millis.end = 0
  currentGroup = null
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging.value)
    return

  const cell = event.target as HTMLTableCellElement
  if (!(cell instanceof HTMLTableCellElement))
    return

  const currentMillis = {
    start: parseTime(cell.getAttribute('data-time')!.split('-')[0].replaceAll('@', ':')),
    end: parseTime(cell.getAttribute('data-time')!.split('-')[1].replaceAll('@', ':')),
  }

  if (millis.start === 0 || currentMillis.start < millis.start)
    millis.start = currentMillis.start

  if (millis.end === 0 || currentMillis.end > millis.end)
    millis.end = currentMillis.end

  currentGroup = cell.getAttribute('data-group')
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
          <td :id="group" class="border-r border-gray-200 px-12 py-8 text-left font-semibold text-blue-600">
            {{ group }}
          </td>
          <td v-for="time in timeRange" :key="time" class="border-r border-gray-200" :data-group="group" :data-time="time.replaceAll(' ', '').replaceAll(':', '@')" @mousedown.prevent="onMouseDown" @mouseup.prevent="onMouseUp" @mousemove.prevent="onMouseMove" />
        </tr>
      </tbody>
    </table>
  </div>

  <div class="fixed bottom-0 right-0 z-10">
    <div v-for="(lecture, index) in lectures" :key="index" class="m-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900">
      <span class="font-semibold">{{ lecture.group }}, </span>
      <span>
        {{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}
      </span>
    </div>
  </div>
</template>
