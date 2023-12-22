<script setup lang="ts">
const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

// Interfaces
interface Lecture {
  start: Date
  end: Date
  group: string
}

// Cells
const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
  .map(([start, end]) => [
    start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
   end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  ])
  .map(([start, end]) => `${start} - ${end}`)

function getCellId(group: string, time: string) {
  return `${group}@${time.replace(' - ', '@')}`
}

// Mouse events
const lectures = ref<Lecture[]>([])
const _lectures = ref<Lecture[]>([])
const isDragging = ref(false)

function onMouseDown() {
  isDragging.value = true
}

function onMouseUp() {
  isDragging.value = false

  const firstLecture = _lectures.value[0]
  const lastLecture = _lectures.value[_lectures.value.length - 1]

  lectures.value.push({
    start: firstLecture.start,
    end: lastLecture.end,
    group: firstLecture.group,
  })

  setTimeout(() => {
    lectures.value = lectures.value.slice(1)
  }, 2000)

  _lectures.value = []
}

let lastCellId = '';

function onMouseMove(event: MouseEvent) {
  if (!isDragging.value) return

  const cell = event.target as HTMLTableCellElement
  if (!cell || !(cell instanceof HTMLTableCellElement)) return

  if (cell.id === lastCellId) return

  lastCellId = cell.id;

  const [group, start, end] = cell.id.split('@')
  const [startHour, startMinute] = start.split(':')
  const [endHour, endMinute] = end.split(':')

  const baseDate = new Date(2023, 0, 1)
  const startMillis = baseDate.getTime() + Number(startHour) * 60 * 60 * 1000 + Number(startMinute) * 60 * 1000
  const endMillis = baseDate.getTime() + Number(endHour) * 60 * 60 * 1000 + Number(endMinute) * 60 * 1000

  const lecture: Lecture = {
    start: new Date(startMillis),
    end: new Date(endMillis),
    group,
  }

  _lectures.value.push(lecture)
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
          <td v-for="time in timeRange" :id="getCellId(group, time)" :key="time" class="border-r border-gray-200" @mousedown.prevent="onMouseDown" @mouseup.prevent="onMouseUp" @mousemove.prevent="onMouseMove" />
        </tr>
      </tbody>
    </table>
  </div>

  <div class="fixed bottom-0 right-0 z-10">
      <div v-for="(lecture, index) in lectures" :key="index" class="border-gray-200 border text-gray-900 rounded-lg px-4 py-2 m-2">
        <span class="font-semibold">{{ lecture.group }}, </span>
        <span>
        {{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}
        </span>
      </div>
  </div>
</template>
