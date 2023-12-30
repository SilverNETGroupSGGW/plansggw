<script setup lang="ts">
const lecturers = useLecturers()
await lecturers.get()
</script>

<template>
  <base-table :data="lecturers.data" :columns="lecturers.columns">
    <template #academicDegree="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.academicDegree }}</span>
    </template>

    <template #firstName="{ cell }">
      <span class="text-base font-medium text-gray-900">{{ cell.firstName }} {{ cell.surname }}</span>
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
