<script setup lang="ts">
import { KeyIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/vue/20/solid'
import type { Group } from '~/types'

// Nuxt hooks
const route = useRoute()

// Groups
const search = ref('')
const groups = useGroups()
await groups.get(route.params.scheduleId as string)

function filter(row: Group) {
  return Object.values(row).some((value) => {
    if (typeof value === 'string')
      return value.toLowerCase().includes(search.value.toLowerCase())
    else
      return false
  })
}

// Update group dialog
const updateDialog = ref(false)
const currentGroup = ref<Group>({
  id: '',
  name: '',
})

async function handleUpdate() {
  await groups.update(currentGroup.value)
  updateDialog.value = false

  currentGroup.value = {
    id: '',
    name: '',
  }
}

// Delete group dialog
const deleteDialog = ref(false)

async function handleDelete() {
  await groups.delete(currentGroup.value)
  deleteDialog.value = false

  groups.data = groups.data.filter(group => group.id !== currentGroup.value.id)
  currentGroup.value = {
    id: '',
    name: '',
  }
}

// Create group dialog
const createDialog = ref(false)

async function handleCreate() {
  await groups.create(currentGroup.value)
  createDialog.value = false

  currentGroup.value = {
    id: '',
    name: '',
  }
}

// Shared
function handleDialogOpen(mode: 'create' | 'update' | 'delete', id?: string) {
  if (id) {
    const group = groups.data.find(group => group.id === id)
    if (group)
      currentGroup.value = { ...group }

    if (mode === 'update')
      updateDialog.value = true
    else
      deleteDialog.value = true
  }
  else {
    currentGroup.value = {
      id: '',
      name: '',
    }

    createDialog.value = true
  }
}
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-4 border border-b-gray-200 px-12 py-9">
    <div>
      <h1 class="text-2xl font-bold leading-9 text-gray-900">
        Grupy
      </h1>
    </div>

    <div class="flex gap-4">
      <base-input v-model="search" placeholder="Szukaj" class="w-96" :icon="MagnifyingGlassIcon" />
      <base-button variant="primary" @click="handleDialogOpen('create')">
        Dodaj grupę
      </base-button>
      <base-button to="/schedules" variant="secondary">
        Wróć do planów
      </base-button>
    </div>
  </div>

  <base-table :data="groups.data" :columns="groups.columns" :filter="(row) => filter(row)">
    <template #name="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.name }}</span>
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

  <base-dialog v-model="createDialog" title="Dodaj grupe" :icon="UserGroupIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleCreate">
      <base-input v-model="currentGroup.id" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentGroup.name" :icon="PencilIcon" label="Nazwa" />

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

  <base-dialog v-model="updateDialog" title="Edytuj grupe" :icon="UserGroupIcon">
    <form class="flex flex-col gap-4" @submit.prevent="handleUpdate">
      <base-input v-model="currentGroup.id" :icon="KeyIcon" label="ID" disabled />
      <base-input v-model="currentGroup.name" :icon="PencilIcon" label="Nazwa" />

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

  <base-dialog v-model="deleteDialog" title="Usuń grupę" :icon="TrashIcon">
    <p class="text-base text-gray-700">
      Czy na pewno chcesz usunąć grupę?
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
