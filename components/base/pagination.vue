<script setup lang="ts" generic="T">
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

defineProps<{
  modelValue: number
  filteredData: T[]
}>()

defineEmits<{
  (e: 'update:modelValue', modelValue: number): void
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <button class="text-blue-600 disabled:text-blue-400" :disabled="modelValue === 1" @click="$emit('update:modelValue', 1)">
      <ChevronDoubleLeftIcon class="h-5 w-5" />
    </button>
    <button class="text-blue-600 disabled:text-blue-400" :disabled="modelValue === 1" @click="$emit('update:modelValue', modelValue - 1)">
      <ChevronLeftIcon class="h-5 w-5" />
    </button>

    <span class="text-gray-700">
      Strona
      <span class="font-medium">{{ modelValue }}</span>
      z
      <span class="font-medium">{{ Math.ceil(filteredData.length / 10) }}</span>
    </span>

    <button class="text-blue-600 disabled:text-blue-400" :disabled="modelValue * 10 >= filteredData.length" @click="$emit('update:modelValue', modelValue + 1)">
      <ChevronRightIcon class="h-5 w-5" />
    </button>

    <button class="text-blue-600 disabled:text-blue-400" :disabled="modelValue * 10 >= filteredData.length" @click="$emit('update:modelValue', Math.ceil(filteredData.length / 10))">
      <ChevronDoubleRightIcon class="h-5 w-5" />
    </button>
  </div>
</template>
