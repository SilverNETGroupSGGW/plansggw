<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

withDefaults(defineProps<{
  modelValue: string
  icon?: FunctionalComponent
  dark?: boolean
  label?: string
  caption?: string
}>(), {
  dark: false,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="relative flex flex-col">
    <label v-if="label" class="mb-1 font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative w-full">
      <component :is="icon" v-if="icon" class="absolute left-6 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
      <input :value="modelValue" class="flex h-12 flex-col items-start justify-center self-stretch rounded-lg border border-gray-300 py-4 pr-6 text-gray-700 transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:transition-all hover:duration-200 hover:ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:transition-all focus:duration-200 focus:ease-in-out active:ring-2 active:ring-blue-600 disabled:bg-gray-100" v-bind="$attrs" :class="[icon ? 'pl-12' : 'pl-6']" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    </div>
    <label v-if="caption" class="text-sm text-blue-600">
      {{ caption }}
    </label>
  </div>
</template>
