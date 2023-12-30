<script setup lang="ts">
import { InboxIcon, KeyIcon, MagnifyingGlassIcon, TrashIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/outline'
import type { Lecturer } from '~/types'

// Lecturers
const search = ref('')
const lecturers = useLecturers()
await lecturers.get()

function filter(row: Lecturer) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}

// Update lecturer dialog
const updateDialog = ref(false)
const currentLecturer = ref<Lecturer>({
  id: '',
  firstName: '',
  surname: '',
  academicDegree: '',
  email: '',
})

async function handleUpdate() {
  await lecturers.update(currentLecturer.value)
  updateDialog.value = false

  currentLecturer.value = {
    id: '',
    firstName: '',
    surname: '',
    academicDegree: '',
    email: '',
  }
}

// Delete lecturer dialog
const deleteDialog = ref(false)

async function handleDelete() {
  await lecturers.delete(currentLecturer.value)
  deleteDialog.value = false

  lecturers.data = lecturers.data.filter(lecturer => lecturer.id !== currentLecturer.value.id)
  currentLecturer.value = {
    id: '',
    firstName: '',
    surname: '',
    academicDegree: '',
    email: '',
  }
}

// Create lecturer dialog
const createDialog = ref(false)

async function handleCreate() {
  await lecturers.create(currentLecturer.value)
  createDialog.value = false

  lecturers.data.push({ ...currentLecturer.value })
  currentLecturer.value = {
    id: '',
    firstName: '',
    surname: '',
    academicDegree: '',
    email: '',
  }
}

// Shared
function handleDialogOpen(mode: 'create' | 'update' | 'delete', id?: string) {
  if (id) {
    const lecturer = lecturers.data.find(lecturer => lecturer.id === id)
    if (lecturer) {
      currentLecturer.value = { ...lecturer }

      if (mode === 'update')
        updateDialog.value = true
      else
        deleteDialog.value = true
    }
  }
  else {
    currentLecturer.value = {
      id: '',
      firstName: '',
      surname: '',
      academicDegree: '',
      email: '',
    }

    createDialog.value = true
  }
}
</script>

<template>
  <div class="flex w-full flex-wrap justify-between gap-4 border border-b-gray-200 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Wykładowcy<br>
      </h1>
      <p class="text-base font-normal leading-normal text-gray-700">
        Dane pochodzą z
        <span class="text-base font-semibold leading-normal text-blue-600">Bazy Wiedzy SGGW</span>
      </p>
    </div>

    <div class="flex gap-4">
      <base-input v-model="search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
      <base-button class="h-12" variant="primary" @click="handleDialogOpen('create')">
        Dodaj wykładowcę
      </base-button>
    </div>
  </div>

  <base-table :data="lecturers.data" :columns="lecturers.columns" :filter="(row) => filter(row)">
    <template #academicDegree="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.academicDegree }}</span>
    </template>

    <template #firstName="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.firstName }} {{ cell.surname }}</span>
    </template>

    <template #email="{ cell }">
      <a class="text-base text-blue-600 underline" :href="`mailto:${cell.email}`">{{ cell.email }}</a>
    </template>

    <template #actions="{ cell }">
      <div class="flex gap-4">
        <button class="font-medium text-green-600" @click="handleDialogOpen('update', cell.id!)">
          Edytuj
        </button>
        <button class="font-medium text-red-600" @click="handleDialogOpen('delete', cell.id!)">
          Usuń
        </button>
      </div>
    </template>
  </base-table>

  <base-dialog v-model="createDialog" title="Dodaj wykładowcę" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleCreate">
      <base-input v-model="currentLecturer.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentLecturer.firstName" class="w-full" :icon="UserIcon" label="Imię" />
      <base-input v-model="currentLecturer.surname" class="w-full" :icon="UserIcon" label="Nazwisko" />
      <base-input v-model="currentLecturer.academicDegree" class="w-full" :icon="TrophyIcon" label="Stopień naukowy" />
      <base-input v-model="currentLecturer.email" class="w-full" :icon="InboxIcon" label="E-mail" />

      <div class="mt-6 flex justify-end gap-4">
        <base-button variant="secondary" @click="createDialog = false">
          Zamknij
        </base-button>
        <base-button variant="primary" type="submit">
          Zapisz zmiany
        </base-button>
      </div>
    </form>
  </base-dialog>

  <base-dialog v-model="updateDialog" title="Edytuj wykładowcę" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleUpdate">
      <base-input v-model="currentLecturer.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentLecturer.firstName" class="w-full" :icon="UserIcon" label="Imię" />
      <base-input v-model="currentLecturer.surname" class="w-full" :icon="UserIcon" label="Nazwisko" />
      <base-input v-model="currentLecturer.academicDegree" class="w-full" :icon="TrophyIcon" label="Stopień naukowy" />
      <base-input v-model="currentLecturer.email" class="w-full" :icon="InboxIcon" label="E-mail" />

      <div class="mt-6 flex justify-end gap-4">
        <base-button variant="secondary" @click="updateDialog = false">
          Zamknij
        </base-button>
        <base-button variant="primary" type="submit">
          Zapisz zmiany
        </base-button>
      </div>
    </form>
  </base-dialog>

  <base-dialog v-model="deleteDialog" title="Usuń wykładowcę" :icon="TrashIcon">
    <p class="text-base text-gray-700">
      Czy na pewno chcesz usunąć wykładowcę?
    </p>

    <div class="mt-6 flex justify-end gap-4">
      <base-button variant="secondary" @click="deleteDialog = false">
        Zamknij
      </base-button>
      <base-button variant="danger" @click="handleDelete">
        Usuń
      </base-button>
    </div>
  </base-dialog>
</template>
