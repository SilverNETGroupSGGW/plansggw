<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import type { Subject } from '~/types'

// Nuxt hooks
const route = useRoute()

// Subjects
const search = ref('')
const subjects = useSubjects()
await subjects.get(route.params.scheduleId as string)

function filter(row: Subject) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-4 border border-b-gray-200 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Przedmioty
      </h1>
    </div>

    <div class="flex gap-4">
      <base-input v-model="search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
    </div>
  </div>

  <base-table :data="subjects.data" :columns="subjects.columns" :filter="(row) => filter(row)">
    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
    </template>

    <template #actions="{ cell }">
      <div class="flex gap-4">
        <NuxtLink :to="`/schedules/${route.params.scheduleId}/subjects/${cell.id}`" class="font-medium text-green-600">
          Edytuj
        </NuxtLink>
      </div>
    </template>
  </base-table>
</template>
