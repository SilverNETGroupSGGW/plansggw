<script setup lang="ts">
function* chunk<T>(array: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < array.length; i += n)
    yield array.slice(i, i + n)
}

function generateTimeRange(start: Date, end: Date, step: number) {
  const result = [] as Date[]
  let current = new Date(start)
  while (current < end) {
    result.push(current)
    current = new Date(current.getTime() + step * 60000)
  }
  return result
}

function generateTimeInterval(start: Date, end: Date, step: number) {
  const result = []
  let current = new Date(start)
  while (current < end) {
    for (let i = 0; i < 2; i++) {
      result.push(current)
      result.push(new Date(current.getTime() + step * 60000))

      current = new Date(current.getTime() + step * 60000)
    }
  }

  return result
}

const hoursRange = generateTimeRange(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 60)
  .map(date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))

const timeRange
  = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
    .map(([start, end]) => [
      start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    ])
    .map(([start, end]) => `${start} - ${end}`)
</script>

<template>
  <div class="flex w-full flex-wrap justify-between gap-4 border border-b-gray-200 bg-gray-50 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Kreator planu zajęć<br>
      </h1>
      <p class="text-base font-normal leading-normal text-gray-700">
        Informatyka, semestr 5, rok akademicki 2023/2024
        <br>
        Specjalizacja Techniki Multimedialne
      </p>
    </div>
  </div>

  <div class="flex h-full flex-col gap-1 overflow-scroll px-12 py-9">
    <div class="flex gap-1">
      <div class="aspect-square h-28 w-28" />
      <div class="flex aspect-square h-28 w-28 items-center justify-center border border-gray-200 text-center" />
      <div v-for="(hour, index) in timeRange" :key="index" class="flex aspect-square h-28 w-28 items-center justify-center border border-gray-200 text-center">
        <small class="-rotate-45 font-semibold text-gray-800">
          {{ hour }}
        </small>
      </div>
    </div>
    <div class="flex gap-1">
      <div class="flex aspect-square h-auto w-28 items-center justify-center border border-gray-200 text-center">
        <small class="-rotate-90 font-semibold text-gray-800">
          Poniedziałek
        </small>
      </div>
      <div class="flex flex-col gap-1">
        <div v-for="group in ['ISI-1', 'ISI-2', 'ISK', 'TM']" :key="group" class="flex h-28 w-28 items-center justify-center border border-gray-200">
          {{ group }}
        </div>
      </div>
    </div>
  </div>
</template>
