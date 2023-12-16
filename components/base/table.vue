<script setup lang="ts" generic="T">
import { MagnifyingGlassMinusIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  filter: (row: T) => boolean
  data: T[]
  columns: { key: string, header: string }[]
}>()

const page = ref(1)

const filteredData = computed(() => props.data.filter(props.filter))
const paginatedData = computed(() => filteredData.value.slice((page.value - 1) * 10, page.value * 10))
</script>

<template>
  <table class="w-full">
    <thead class="border-b border-gray-200">
      <tr>
        <th v-for="column in columns" :key="column.key" class="px-12 py-2 text-left font-semibold text-blue-600">
          {{ column.header }}
        </th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-200  align-top">
      <tr v-for="(row, index) in paginatedData" :key="index">
        <template v-if="paginatedData.length > 0">
          <td v-for="column in columns" :key="column.key" class="px-12 py-4">
            <slot :name="column.key" :cell="row" :index="index" />
          </td>
        </template>
      </tr>

      <tr v-if="paginatedData.length === 0">
        <td :colspan="columns.length + 1" class="px-12 py-4">
          <div class="flex items-center justify-center gap-2">
            <MagnifyingGlassMinusIcon class="h-5 w-5 text-gray-400" />
            <span class="text-gray-400">Brak wyników</span>
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot class="border-y border-gray-200">
      <tr>
        <td :colspan="columns.length + 1" class="px-12 py-4">
          <div class="flex justify-between">
            <slot name="footer" />
            <base-pagination v-model="page" :filtered-data="filteredData" />
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>
