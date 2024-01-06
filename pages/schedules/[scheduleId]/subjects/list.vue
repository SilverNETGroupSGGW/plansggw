<script setup lang="ts">
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/20/solid'
import { SubjectType } from '~/types'

// Nuxt hooks
const route = useRoute()

// Subjects
const subjects = useSubjects()
await subjects.get(route.params.scheduleId as string)

const { currentItem, deleteDialog, handleDelete, handleDialogOpen, search } = useCrud(subjects.data)
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
      <base-button variant="primary" :to="`/schedules/${route.params.scheduleId}/subjects/create`">
        Dodaj przedmiot
      </base-button>
      <base-button variant="secondary" :to="`/schedules/${route.params.scheduleId}/monday`">
        Wróć do kreatora
      </base-button>
    </div>
  </div>

  <base-table :data="subjects.data" :columns="subjects.columns" :search="search">
    <template #name="{ cell }">
      <span class="text-base font-semibold text-gray-900">{{ cell.name }}</span>

      <div class="text-sm text-indigo-600">
        <template v-if="cell.type === SubjectType.Lecture">
          <span>Wykład</span>
        </template>
        <template v-else-if="cell.type === SubjectType.Laboratories">
          <span>Laboratorium</span>
        </template>
        <template v-else-if="cell.type === SubjectType.PracticalClasses">
          <span>Ćwiczenia</span>
        </template>
        <template v-else-if="cell.type === SubjectType.Faculty">
          <span>Fakultet</span>
        </template>
        <template v-else-if="cell.type === SubjectType.Unknown">
          <span>Inne</span>
        </template>,

        <template v-if="cell.isRemote">
          <span>zdalnie</span>
        </template>
        <template v-else>
          <span>stacjonarnie</span>
        </template>
      </div>

      <div class="text-sm text-gray-700">
        <span v-if="cell.dayOfWeek === 'Monday'">Poniedziałek</span>
        <span v-else-if="cell.dayOfWeek === 'Tuesday'">Wtorek</span>
        <span v-else-if="cell.dayOfWeek === 'Wednesday'">Środa</span>
        <span v-else-if="cell.dayOfWeek === 'Thursday'">Czwartek</span>
        <span v-else-if="cell.dayOfWeek === 'Friday'">Piątek</span>
        <span v-else-if="cell.dayOfWeek === 'Saturday'">Sobota</span>
        <span v-else-if="cell.dayOfWeek === 'Sunday'">Niedziela</span>

        <span v-if="cell.startTime">, {{ cell.startTime }}</span>
        <span v-if="cell.duration"> ({{ cell.duration }} min)</span>
      </div>

      <div class="text-sm text-gray-700">
        <span>Sala: {{ cell.classroom!.name }}, budynek {{ cell.classroom!.building }}, piętro {{ cell.classroom!.floor }}</span>
      </div>

      <div class="text-sm text-gray-700">
        <span>Grupa: {{ cell.groups!.map(x => x.name).join(", ") }}</span>
      </div>
    </template>

    <template #lecturers="{ cell }">
      <div class="flex flex-wrap gap-2">
        <span v-for="lecturer in cell.lecturers" :key="lecturer.id" class="font-medium text-gray-700">
          {{ lecturer.academicDegree }} {{ lecturer.firstName }} {{ lecturer.surname }}
        </span>
      </div>
    </template>

    <template #actions="{ cell }">
      <div class="flex gap-4">
        <NuxtLink :to="`/schedules/${route.params.scheduleId}/subjects/${cell.id}`" class="font-medium text-green-600">
          Edytuj
        </NuxtLink>
        <button class="font-medium text-red-600" @click="handleDialogOpen('delete', cell.id!)">
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
      <base-button variant="danger" @click="handleDelete(currentItem, async() => await subjects.delete(currentItem.id))">
        Usuń
      </base-button>
    </div>
  </base-dialog>
</template>
