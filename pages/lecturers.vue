<script setup lang="ts">
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'

const lecturers = useLecturers()
lecturers.dispatch()
</script>

<template>
  <div class="flex w-full flex-wrap justify-between gap-4 border border-b-gray-200 bg-gray-50 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Wykładowcy<br>
      </h1>
      <p class="text-base font-normal leading-normal text-gray-700">
        Dane pochodzą z
        <span class="text-base font-semibold leading-normal text-blue-600">Bazy Wiedzy SGGW</span>
      </p>
    </div>
    <base-input v-model="lecturers.search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
  </div>

  <base-table :data="lecturers.data" :columns="lecturers.columns" :filter="(row) => lecturers.filter(row)">
    <template #degree="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.degree }}</span>
    </template>

    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
      <br>
      <span class="text-gray-700">{{ cell.faculty }}</span>
    </template>

    <template #actions="{ cell }">
      <div class="flex gap-4">
        <button class="font-medium text-green-600">
          Edytuj
        </button>
        <button class="font-medium text-red-600" @click="lecturers.delete(cell.id)">
          Usuń
        </button>
      </div>
    </template>

    <template #footer>
      <button class="flex items-center gap-2 font-medium text-blue-600">
        <PlusIcon class="h-4 w-4" />
        Dodaj nowego wykładowcę
      </button>
    </template>
  </base-table>
</template>
