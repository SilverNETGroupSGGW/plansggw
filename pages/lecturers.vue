<script setup lang="ts">
import { ChatBubbleBottomCenterIcon, PlusIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/outline'

const createDialog = ref(false)
const updateDialog = ref(false)

const activeLecturer = ref<number | null>(null)

const updatedLecturer = ref({
  id: 0,
  name: '',
  faculty: '',
  degree: '',
})

const lecturers = useLecturers()
lecturers.dispatch()

function handleDialogOpen(id: number) {
  activeLecturer.value = id
  updatedLecturer.value = JSON.parse(JSON.stringify(lecturers.getById(id)!))
  updateDialog.value = true
}

function handleFormSubmit(mode: 'create' | 'update') {
  if (mode === 'create') {
    lecturers.create(updatedLecturer.value)
    createDialog.value = false
  }
  else {
    lecturers.update(activeLecturer.value!, updatedLecturer.value)
    updateDialog.value = false
  }
}
</script>

<template>
  <base-dialog v-model="createDialog" title="Dodaj nowego wykładowcę" :icon="PlusIcon">
    <form class="flex flex-col gap-4 p-6" @submit.prevent="handleFormSubmit('create')">
      <base-input v-model="updatedLecturer.name" class="w-full" :icon="UserIcon" label="Imię i nazwisko" />
      <base-input v-model="updatedLecturer.faculty" class="w-full" :icon="ChatBubbleBottomCenterIcon" label="Wydział" />
      <base-input v-model="updatedLecturer.degree" class="w-full" :icon="TrophyIcon" label="Stopień naukowy" />

      <div class="flex justify-end gap-4">
        <button class="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-2 font-medium text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 active:ring-2 active:ring-gray-100" @click="createDialog = false">
          Zamknij
        </button>

        <button type="submit" class="flex items-center justify-center rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-colors duration-200 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-100 active:ring-2 active:ring-blue-100">
          Dodaj wykładowcę
        </button>
      </div>
    </form>
  </base-dialog>

  <base-dialog v-model="updateDialog" title="Edytuj wykładowcę" :icon="UserIcon">
    <form class="flex flex-col gap-4 p-6" @submit.prevent="handleFormSubmit('update')">
      <base-input v-model="updatedLecturer.name" class="w-full" :icon="UserIcon" label="Imię i nazwisko" />
      <base-input v-model="updatedLecturer.faculty" class="w-full" :icon="ChatBubbleBottomCenterIcon" label="Wydział" />
      <base-input v-model="updatedLecturer.degree" class="w-full" :icon="TrophyIcon" label="Stopień naukowy" />

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
        <button class="font-medium text-green-600" @click="handleDialogOpen(cell.id)">
          Edytuj
        </button>
        <button class="font-medium text-red-600" @click="lecturers.delete(cell.id)">
          Usuń
        </button>
      </div>
    </template>

    <template #footer>
      <button class="flex items-center gap-2 font-medium text-blue-600" @click="createDialog = true">
        <PlusIcon class="h-4 w-4" />
        Dodaj nowego wykładowcę
      </button>
    </template>
  </base-table>
</template>
