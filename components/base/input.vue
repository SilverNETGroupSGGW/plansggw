<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

withDefaults(defineProps<{
  icon?: FunctionalComponent
  dark?: boolean
  label?: string
  caption?: string
}>(), {
  dark: false,
})
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <template v-if="dark">
      <label class="font-medium text-gray-50">
        {{ label }}
      </label>
      <input class="flex h-14 flex-col items-start justify-center self-stretch rounded-lg border border-gray-700 bg-gray-900 px-5 py-4 text-gray-50 transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:transition-all hover:duration-200 hover:ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:transition-all focus:duration-200 focus:ease-in-out active:ring-2 active:ring-blue-400" v-bind="$attrs">
      <label v-if="caption" class="text-sm text-blue-400">
        {{ caption }}
      </label>
    </template>

    <template v-else>
      <label class="font-medium text-gray-700">
        {{ label }}
      </label>
      <component :is="icon" v-if="icon" class="absolute left-6 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
      <input class="flex h-12 flex-col items-start justify-center self-stretch rounded-lg border border-gray-300 py-4 pr-6 text-gray-700 transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:transition-all hover:duration-200 hover:ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:transition-all focus:duration-200 focus:ease-in-out active:ring-2 active:ring-blue-600" v-bind="$attrs" :class="[icon ? 'pl-12' : 'pl-6']">
      <label v-if="caption" class="text-sm text-blue-600">
        {{ caption }}
      </label>
    </template>
  </div>
</template>
