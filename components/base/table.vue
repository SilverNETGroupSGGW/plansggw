<script setup lang="ts" generic="T">
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassMinusIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  filter: (row: T) => boolean
  data: T[]
  columns: { key: string, header: string }[]
}>()

const pagination = reactive({
  page: 1,
  perPage: 10,
})

const filteredData = computed(() => props.data.filter(props.filter))
const paginatedData = computed(() => filteredData.value.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage))
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
            <slot :name="column.key" :cell="row" />
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

            <div class="flex items-center gap-2">
              <button class="text-blue-600 disabled:text-blue-400" :disabled="pagination.page === 1" @click="pagination.page = 1">
                <ChevronDoubleLeftIcon class="h-5 w-5" />
              </button>
              <button class="text-blue-600 disabled:text-blue-400" :disabled="pagination.page === 1" @click="pagination.page -= 1">
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <span class="text-gray-700">
                Strona
                <span class="font-medium">{{ pagination.page }}</span>
                z
                <span class="font-medium">{{ Math.ceil(filteredData.length / pagination.perPage) }}</span>
              </span>

              <button class="text-blue-600 disabled:text-blue-400" :disabled="pagination.page * pagination.perPage >= filteredData.length" @click="pagination.page += 1">
                <ChevronRightIcon class="h-5 w-5" />
              </button>

              <button class="text-blue-600 disabled:text-blue-400" :disabled="pagination.page * pagination.perPage >= filteredData.length" @click="pagination.page = Math.ceil(filteredData.length / pagination.perPage)">
                <ChevronDoubleRightIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>
