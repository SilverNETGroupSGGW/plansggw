<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const defaultData = reactive([
  {
    degree: 'mgr inż.',
    name: 'Aleksandra Konopka',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
  {
    degree: 'dr',
    name: 'Agnieszka Kampka',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
  {
    degree: 'dr',
    name: 'Izabella Antoniuk',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
  {
    degree: 'mgr',
    name: 'Dariusz Makowski',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
  {
    degree: 'mgr',
    name: 'Oleksandr Fedoruk',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
  {
    degree: 'dr',
    name: 'Andrzej Zembrzuski',
    faculty: 'Wydział Zastosowań Informatyki i Matematyki',
  },
])

const columns = reactive([
  {
    key: 'degree',
    header: 'Stopień naukowy',
  },
  {
    key: 'name',
    header: 'Imię i nazwisko',
  },
  {
    key: 'actions',
    header: 'Akcje',
  },
])
</script>

<template>
  <div class="flex w-full justify-between border border-b-gray-200 bg-gray-50 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Wykładowcy<br>
      </h1>
      <p class="text-base font-normal leading-normal text-gray-700">
        Dane pochodzą z
        <span class="text-base font-semibold leading-normal text-blue-600">Bazy Wiedzy SGGW</span>
      </p>
    </div>
    <base-input placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
  </div>
  <base-table :default-data="defaultData" :columns="columns">
    <template #degree="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.degree }}</span>
    </template>
    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
      <br>
      <span class="text-gray-800">{{ cell.faculty }}</span>
    </template>
    <template #actions>
      <div class="flex gap-4">
        <button class="font-medium text-green-600">
          Edytuj
        </button>
        <button class="font-medium text-red-600">
          Usuń
        </button>
      </div>
    </template>
  </base-table>
</template>
