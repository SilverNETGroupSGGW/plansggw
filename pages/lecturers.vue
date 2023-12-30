<script setup lang="ts">
import { InboxIcon, KeyIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/outline'
import type { Lecturer } from '~/types'

// Lecturers
const lecturers = useLecturers()
await lecturers.get()

// Update lecturer dialog
const updateDialog = ref(false)
const updatedLecturer = ref<Lecturer>({
  id: '',
  firstName: '',
  surname: '',
  academicDegree: '',
  email: '',
})

function handleDialogOpen(id: string) {
  const lecturer = lecturers.data.find(lecturer => lecturer.id === id)
  if (lecturer) {
    updatedLecturer.value = lecturer
    updateDialog.value = true
  }
}

async function handleFormSubmit() {
  await lecturers.update(updatedLecturer.value)
  updateDialog.value = false
}
</script>

<template>
  <base-table :data="lecturers.data" :columns="lecturers.columns">
    <template #academicDegree="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.academicDegree }}</span>
    </template>

    <template #firstName="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.firstName }} {{ cell.surname }}</span>
    </template>

    <template #actions="{ cell }">
      <div class="flex gap-4">
        <button class="font-medium text-green-600" @click="handleDialogOpen(cell.id!)">
          Edytuj
        </button>
        <button class="font-medium text-red-600">
          Usuń
        </button>
      </div>
    </template>
  </base-table>

  <base-dialog v-model="updateDialog" title="Edytuj wykładowcę" :icon="UserIcon">
    <form class="flex flex-col gap-4 p-6" @submit.prevent="handleFormSubmit">
      <base-input v-model="updatedLecturer.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="updatedLecturer.firstName" class="w-full" :icon="UserIcon" label="Imię" />
      <base-input v-model="updatedLecturer.surname" class="w-full" :icon="UserIcon" label="Nazwisko" />
      <base-input v-model="updatedLecturer.academicDegree" class="w-full" :icon="TrophyIcon" label="Stopień naukowy" />
      <base-input v-model="updatedLecturer.email" class="w-full" :icon="InboxIcon" label="E-mail" />

      <div class="flex justify-end gap-4">
        <button class="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-2 font-medium text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 active:ring-2 active:ring-gray-100" @click="updateDialog = false">
          Zamknij
        </button>

        <button type="submit" class="flex items-center justify-center rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-colors duration-200 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-100 active:ring-2 active:ring-blue-100">
          Zapisz zmiany
        </button>
      </div>
    </form>
  </base-dialog>
</template>
