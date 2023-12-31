<script setup lang="ts">
import { ViewfinderCircleIcon } from '@heroicons/vue/20/solid'
import { AcademicCapIcon, BriefcaseIcon, CalendarIcon, CloudIcon, KeyIcon, MagnifyingGlassIcon, PencilIcon, TrophyIcon, TrashIcon, UserIcon } from '@heroicons/vue/24/outline'
import type { Schedule } from '~/types'

// Schedules
const search = ref('')
const schedules = useSchedule()
await schedules.get()

function filter(row: Schedule) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}

// Update schedule dialog
const updateDialog = ref(false)
const currentSchedule = ref<Schedule>({
  id: '',
  startDate: '',
  name: '',
  year: 0,
  semester: 0,
  faculty: '',
  fieldOfStudy: '',
  studyMode: '',
  degreeOfStudy: '',
  subjects: [],
})

async function handleUpdate() {
  await schedules.update(currentSchedule.value)
  updateDialog.value = false

  currentSchedule.value = {
    id: '',
    startDate: '',
    name: '',
    year: 0,
    semester: 0,
    faculty: '',
    fieldOfStudy: '',
    studyMode: '',
    degreeOfStudy: '',
    subjects: [],
  }
}

// Delete schedule dialog
const deleteDialog = ref(false)

async function handleDelete() {
  await schedules.delete(currentSchedule.value)
  deleteDialog.value = false

  schedules.data = schedules.data.filter(schedule => schedule.id !== currentSchedule.value.id)
  currentSchedule.value = {
    id: '',
    startDate: '',
    name: '',
    year: 0,
    semester: 0,
    faculty: '',
    fieldOfStudy: '',
    studyMode: '',
    degreeOfStudy: '',
    subjects: [],
  }
}

// Create schedule dialog
const createDialog = ref(false)

async function handleCreate() {
  await schedules.create(currentSchedule.value)
  createDialog.value = false

  currentSchedule.value = {
    id: '',
    startDate: '',
    name: '',
    year: 0,
    semester: 0,
    faculty: '',
    fieldOfStudy: '',
    studyMode: '',
    degreeOfStudy: '',
    subjects: [],
  }
}

// Shared
function handleDialogOpen(mode: 'create' | 'update' | 'delete', id?: string) {
  if (id) {
    const schedule = schedules.data.find(schedule => schedule.id === id)
    if (schedule)
      currentSchedule.value = { ...schedule }

    if (mode === 'update')
      updateDialog.value = true
    else
      deleteDialog.value = true
  }
  else {
    currentSchedule.value = {
      id: '',
      startDate: '',
      name: '',
      year: 0,
      semester: 0,
      faculty: '',
      fieldOfStudy: '',
      studyMode: '',
      degreeOfStudy: '',
      subjects: [],
    }

    createDialog.value = true
  }
}
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-4 border-b border-b-gray-200 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Plany zajęć
      </h1>
    </div>

    <div class="flex gap-4">
      <base-input v-model="search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
      <base-button class="h-12" variant="primary" @click="handleDialogOpen('create')">
        Dodaj plan
      </base-button>
    </div>
  </div>

  <base-table :data="schedules.data" :columns="schedules.columns" :filter="(row) => filter(row)">
    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
    </template>

    <template #info="{ cell }">
      <span class="text-base font-medium text-gray-900">
        {{ cell.fieldOfStudy }} {{ cell.studyMode }} {{ cell.degreeOfStudy }}
      </span>
      <br>
      <span class="text-base text-gray-700">rok {{ cell.year }}, semestr {{ cell.semester }}</span>
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

  <base-dialog v-model="createDialog" title="Dodaj plan" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleCreate">
      <base-input v-model="currentSchedule.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentSchedule.name" class="w-full" :icon="PencilIcon" label="Nazwa" />
      <base-input v-model="currentSchedule.faculty" class="w-full" :icon="AcademicCapIcon" label="Wydział" />
      <base-input v-model="currentSchedule.fieldOfStudy" class="w-full" :icon="ViewfinderCircleIcon" label="Kierunek" />
      <base-input v-model="currentSchedule.studyMode" class="w-full" :icon="CloudIcon" label="Tryb studiów" />
      <base-input v-model="currentSchedule.degreeOfStudy" class="w-full" :icon="TrophyIcon" label="Stopień studiów" />
      <base-input v-model="currentSchedule.year" type="number" class="w-full" :icon="CalendarIcon" label="Rok" />
      <base-input v-model="currentSchedule.semester" type="number" class="w-full" :icon="BriefcaseIcon" label="Semestr" />

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

  <base-dialog v-model="updateDialog" title="Edytuj plan" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleUpdate">
      <base-input v-model="currentSchedule.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentSchedule.name" class="w-full" :icon="PencilIcon" label="Nazwa" />
      <base-input v-model="currentSchedule.faculty" class="w-full" :icon="AcademicCapIcon" label="Wydział" />
      <base-input v-model="currentSchedule.fieldOfStudy" class="w-full" :icon="ViewfinderCircleIcon" label="Kierunek" />
      <base-input v-model="currentSchedule.studyMode" class="w-full" :icon="CloudIcon" label="Tryb studiów" />
      <base-input v-model="currentSchedule.degreeOfStudy" class="w-full" :icon="TrophyIcon" label="Stopień studiów" />
      <base-input v-model="currentSchedule.year" type="number" class="w-full" :icon="CalendarIcon" label="Rok" />
      <base-input v-model="currentSchedule.semester" type="number" class="w-full" :icon="BriefcaseIcon" label="Semestr" />

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

  <base-dialog v-model="deleteDialog" title="Usuń plan" :icon="TrashIcon">
    <p class="text-base text-gray-700">
      Czy na pewno chcesz usunąć plan?
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
