<script setup lang="ts">
import { useRoute } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { DayOfWeek, type Subject, SubjectType } from '~/types'

// Nuxt hooks
const route = useRoute()

// Data
const lecturers = useLecturers()
await lecturers.get()

const classrooms = useClassrooms()
await classrooms.get()

const search = ref('')

function filter(row: any) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}

const data = ref<Subject | null>(null)

data.value = await $fetch<Subject>(`subjects/${route.params.id}/extended`, {
  baseURL: 'https://kampus-sggw-api.azurewebsites.net/api',
  method: 'GET',
})

const daysOfWeek = [
  { value: DayOfWeek.Monday, label: 'Poniedziałek' },
  { value: DayOfWeek.Tuesday, label: 'Wtorek' },
  { value: DayOfWeek.Wednesday, label: 'Środa' },
  { value: DayOfWeek.Thursday, label: 'Czwartek' },
  { value: DayOfWeek.Friday, label: 'Piątek' },
  { value: DayOfWeek.Saturday, label: 'Sobota' },
  { value: DayOfWeek.Sunday, label: 'Niedziela' },
]

// Time range
const timeRange: Array<{ value: string }> = []
const durationRange: Array<{ value: string }> = []
let initialDate = new Date(2023, 0, 1, 8, 0, 0, 0)

while (initialDate.getHours() <= 20) {
  timeRange.push({ value: new Date(initialDate).toLocaleTimeString() })
  initialDate.setMinutes(initialDate.getMinutes() + 5)
}

initialDate = new Date(2023, 0, 1, 0, 0, 0, 0)
while (initialDate.getHours() <= 4) {
  durationRange.push({ value: new Date(initialDate).toLocaleTimeString() })
  initialDate.setMinutes(initialDate.getMinutes() + 5)
}
</script>

<template>
  <div class="flex w-full flex-col px-12 py-9">
    <div class="flex w-full items-end justify-between">
      <base-input v-model="data!.name" dense class="mb-1 text-xl font-semibold" />

      <div class="flex gap-4">
        <base-button variant="danger" class="h-10">
          Usuń zajęcia
        </base-button>
        <base-button variant="primary" class="h-10">
          Zapisz zmiany
        </base-button>
      </div>
    </div>

    <div class="mb-8 flex">
      <base-button :variant="data!.type === SubjectType.Lecture ? 'primary' : 'secondary'" class="rounded-r-none" @click="data!.type = SubjectType.Lecture">
        Wykład
      </base-button>
      <base-button :variant="data!.type === SubjectType.PracticalClasses ? 'primary' : 'secondary'" class="rounded-none" @click="data!.type = SubjectType.PracticalClasses">
        Ćwiczenia
      </base-button>
      <base-button :variant="data!.type === SubjectType.Laboratories ? 'primary' : 'secondary'" class="rounded-none" @click="data!.type = SubjectType.Laboratories">
        Laboratoria
      </base-button>
      <base-button :variant="data!.type === SubjectType.Unknown ? 'primary' : 'secondary'" class="rounded-l-none" @click="data!.type = SubjectType.Unknown">
        Inne
      </base-button>
    </div>

    <div class="mb-6 flex items-end gap-4  rounded-lg border border-gray-200 p-4">
      <base-search v-model="data!.startTime" :options="timeRange" label="Domyślna godzina rozpoczęcia" />
      <base-search v-model="data!.duration" :options="durationRange" label="Czas trwania" />
    </div>

    <div class="mb-6 flex flex-col rounded-lg border border-gray-200 p-4">
      <label class="mb-1 font-medium text-gray-700">Domyślny dzień tygodnia</label>
      <div class="flex">
        <base-button v-for="(day, index) in daysOfWeek" :key="index" :variant="data!.dayOfWeek === day.value ? 'primary' : 'secondary'" class="h-12" :class="index === 0 ? 'rounded-r-none' : index === daysOfWeek.length - 1 ? 'rounded-l-none' : 'rounded-none'" @click="data!.dayOfWeek = day.value">
          {{ day.label }}
        </base-button>
      </div>
    </div>

    <div class="mb-6 flex flex-col rounded-lg border border-gray-200 p-4">
      <label class="mb-1 font-medium text-gray-700">Prowadzący</label>
      <base-input v-model="search" placeholder="Szukaj" class="mb-1 w-96" :icon="MagnifyingGlassIcon" />

      <div class="rounded-lg border border-gray-200 p-4">
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
            <button v-if="!data!.lecturers?.some(x => cell.id === x.id)" class="font-medium text-blue-600" @click="data!.lecturers!.push(cell)">
              Dodaj
            </button>
            <button v-else class="font-medium text-red-600" @click="data!.lecturers!.splice(data!.lecturers!.findIndex(x => cell.id === x.id), 1)">
              Usuń
            </button>
          </template>
        </base-table>
      </div>
    </div>

    <div class="mb-6 flex flex-col rounded-lg border border-gray-200 p-4">
      <label class="mb-1 font-medium text-gray-700">Sala</label>
      <base-input v-model="search" placeholder="Szukaj" class="mb-1 w-96" :icon="MagnifyingGlassIcon" />

      <div class="rounded-lg border border-gray-200 p-4">
        <base-table :data="classrooms.data" :columns="classrooms.columns" :filter="(row) => filter(row)">
          <template #name="{ cell }">
            <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
          </template>

          <template #actions="{ cell }">
            <button v-if="data!.classroom!.id !== cell.id" class="font-medium text-blue-600" @click="data!.classroom = cell">
              Dodaj
            </button>
            <button v-else class="font-medium text-red-600" @click="data!.classroom = undefined">
              Usuń
            </button>
          </template>
        </base-table>
      </div>
    </div>

    <base-input v-model="data!.comment" label="Komentarz" class="w-full" />
  </div>
</template>
