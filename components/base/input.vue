<script setup lang="ts">
defineProps<{
  label: string
  caption?: string
}>()
</script>

<template>
  <div class="inline-flex w-full flex-col items-start justify-start gap-1">
    <label class="font-medium text-gray-50">
      {{ label }}
    </label>
    <input class="flex h-14 flex-col items-start justify-center self-stretch rounded-lg border border-gray-700 bg-gray-900 px-5 py-4 text-gray-50 transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:transition-all hover:duration-200 hover:ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:transition-all focus:duration-200 focus:ease-in-out active:ring-2 active:ring-blue-400" v-bind="$attrs">
    <label v-if="caption" class="text-sm text-blue-400">
      {{ caption }}
    </label>
  </div>
</template>
