<script setup lang="ts">
const { chunk } = useArray<Date>()
const { generateTimeInterval } = useTime()

const timeRange = [...chunk(generateTimeInterval(new Date(2023, 0, 1, 8), new Date(2023, 0, 1, 20), 15), 2)]
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
          <td :id="group.replace('-', '_')" class="border-r border-gray-200 px-12 py-8 text-left font-semibold text-blue-600">
            {{ group }}
          </td>
          <td v-for="time in timeRange" :id="`${group}-${time}`.replaceAll(' ', '_').replaceAll('-', '_').replaceAll(':', '_')" :key="time" class="border-r border-gray-200" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
