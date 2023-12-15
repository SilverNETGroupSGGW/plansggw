<script setup lang="ts" generic="T">
import { type ColumnDef, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

const props = defineProps<{
  defaultData: T[]
  columns: { key: string, header: string }[]
}>()

function mapColumns() {
  return props.columns.map((column) => {
    return {
      id: column.key.toLowerCase(),
      header: column.header,
      accessorFn: (row: any) => row[column.key],
    }
  }) as ColumnDef<T>[]
}

const { getRowModel, getHeaderGroups } = useVueTable({ columns: mapColumns(), data: props.defaultData, getCoreRowModel: getCoreRowModel() })
</script>

<template>
  <table class="w-full">
    <thead class="border-b border-gray-200">
      <tr v-for="headerGroup in getHeaderGroups()" :key="headerGroup.id">
        <th v-for="header in headerGroup.headers" :id="header.id" :key="header.id" class="px-12 py-2 text-left font-semibold text-blue-600">
          <template v-if="!header.isPlaceholder">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </template>
        </th>
      </tr>
    </thead>
    <tbody class="align-top">
      <tr v-for="row in getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="border-b border-gray-200 px-12 py-4">
          <slot :name="cell.column.columnDef.id" :cell="cell.getValue()" :cell-data="cell.row.original" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
