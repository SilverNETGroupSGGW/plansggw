<script setup lang="ts">
import { KeyIcon, MagnifyingGlassIcon, TrashIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/outline'
import type { Classroom } from '~/types'

// Classrooms
const search = ref('')
const classrooms = useClassrooms()
await classrooms.get()

function filter(row: Classroom) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}

// Update classroom dialog
const updateDialog = ref(false)
const currentClassroom = ref<Classroom>({
  id: '',
  name: '',
  building: '',
  floor: '',
})

async function handleUpdate() {
  await classrooms.update(currentClassroom.value)
  updateDialog.value = false

  currentClassroom.value = {
    id: '',
    name: '',
    building: '',
    floor: '',
  }
}

// Delete classroom dialog
const deleteDialog = ref(false)

async function handleDelete() {
  await classrooms.delete(currentClassroom.value)
  deleteDialog.value = false

  classrooms.data = classrooms.data.filter(classroom => classroom.id !== currentClassroom.value.id)
  currentClassroom.value = {
    id: '',
    name: '',
    building: '',
    floor: '',
  }
}

// Create classroom dialog
const createDialog = ref(false)

async function handleCreate() {
  await classrooms.create(currentClassroom.value)
  createDialog.value = false

  currentClassroom.value = {
    id: '',
    name: '',
    building: '',
    floor: '',
  }
}

// Shared
function handleDialogOpen(mode: 'create' | 'update' | 'delete', id?: string) {
  if (id) {
    const classroom = classrooms.data.find(classroom => classroom.id === id)
    if (classroom)
      currentClassroom.value = classroom

    if (mode === 'update')
      updateDialog.value = true
    else
      deleteDialog.value = true
  }
  else {
    currentClassroom.value = {
      id: '',
      name: '',
      building: '',
      floor: '',
    }

    createDialog.value = true
  }
}
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-4 border border-b-gray-200 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Sale
      </h1>
    </div>

    <div class="flex gap-4">
      <base-input v-model="search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
      <base-button class="h-12" variant="primary" @click="handleDialogOpen('create')">
        Dodaj sale
      </base-button>
    </div>
  </div>

  <base-table :data="classrooms.data" :columns="classrooms.columns" :filter="(row) => filter(row)">
    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
    </template>

    <template #building="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.building }}</span>
    </template>

    <template #floor="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.floor }}</span>
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

  <base-dialog v-model="createDialog" title="Dodaj sale" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleCreate">
      <base-input v-model="currentClassroom.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentClassroom.name" class="w-full" :icon="UserIcon" label="Nazwa" />
      <base-input v-model="currentClassroom.building" class="w-full" :icon="UserIcon" label="Budynek" />
      <base-input v-model="currentClassroom.floor" class="w-full" :icon="TrophyIcon" label="Piętro" />

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

  <base-dialog v-model="updateDialog" title="Edytuj sale" :icon="UserIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleUpdate">
      <base-input v-model="currentClassroom.id" class="w-full" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentClassroom.name" class="w-full" :icon="UserIcon" label="Nazwa" />
      <base-input v-model="currentClassroom.building" class="w-full" :icon="UserIcon" label="Budynek" />
      <base-input v-model="currentClassroom.floor" class="w-full" :icon="TrophyIcon" label="Piętro" />

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

  <base-dialog v-model="deleteDialog" title="Usuń sale" :icon="TrashIcon">
    <p class="text-base text-gray-700">
      Czy na pewno chcesz usunąć sale?
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
