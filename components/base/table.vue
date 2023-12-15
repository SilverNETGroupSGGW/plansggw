<script setup lang="ts" generic="T">
defineProps<{
  data: T[]
  columns: { key: string, header: string }[]
}>()
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
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="column in columns" :key="column.key" class="px-12 py-4">
          <slot :name="column.key" :cell="row" />
        </td>
      </tr>
    </tbody>

    <tfoot class="border-y border-gray-200">
      <tr :colspan="columns.length">
        <td class="px-12 py-4">
          <slot name="footer" />
        </td>
      </tr>
    </tfoot>
  </table>
</template>
