<script setup lang="ts">
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/20/solid'
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

// Delete subject dialog
const currentSubject = ref('')
const deleteDialog = ref(false)

async function handleDelete(id: string) {
  await subjects.delete(id)
  deleteDialog.value = false

  subjects.data = subjects.data.filter(subject => id !== subject.id)
  currentSubject.value = ''
}

// Shared
function handleDialogOpen(id: string) {
  currentSubject.value = id
  deleteDialog.value = true
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
      <base-button variant="primary">
        Dodaj przedmiot
      </base-button>
      <base-button variant="secondary" :to="`/schedules/${route.params.scheduleId}`">
        Wróć do planu
      </base-button>
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
        <button class="font-medium text-red-600" @click="handleDialogOpen(cell.id!)">
          Usuń
        </button>
      </div>
    </template>
  </base-table>

  <base-dialog v-model="deleteDialog" title="Usuń zajęcia" :icon="TrashIcon">
    <p class="text-base text-gray-700">
      Czy na pewno chcesz usunąć zajęcia?
    </p>

    <div class="mt-6 flex justify-end gap-4">
      <base-button variant="secondary" @click="deleteDialog = false">
        Zamknij
      </base-button>
      <base-button variant="danger" @click="handleDelete(currentSubject)">
        Usuń
      </base-button>
    </div>
  </base-dialog>
</template>
