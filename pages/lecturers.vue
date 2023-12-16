<script setup lang="ts">
import { ChatBubbleBottomCenterIcon, MagnifyingGlassIcon, PlusIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/outline'

const dialog = ref(false)

const lecturers = useLecturers()
lecturers.dispatch()
</script>

<template>
  <base-dialog v-model="dialog" title="Edytuj wykładowcę">
    <template #content>
      <div class="flex flex-col gap-4">
        <base-input placeholder="Imię i nazwisko" :icon="UserIcon" />
        <base-input placeholder="Wydział" :icon="ChatBubbleBottomCenterIcon" />
        <base-input placeholder="Stopień naukowy" :icon="TrophyIcon" />
      </div>
    </template>

    <template #actions>
      <div class="flex gap-4">
        <button class="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-2 font-medium text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 active:ring-2 active:ring-gray-100">
          Zamknij
        </button>

        <button class="flex items-center justify-center rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-colors duration-200 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-100 active:ring-2 active:ring-blue-100">
          Zapisz zmiany
        </button>
      </div>
    </template>
  </base-dialog>

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
        <button class="font-medium text-green-600" @click="dialog = true">
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
