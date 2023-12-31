<script setup lang="ts">
defineProps<{
  icon: any
  label: string
  to: string
}>()

const route = useRoute()
</script>

<template>
  <NuxtLink :to="to" class="-mx-3 flex w-full items-center gap-3 rounded-lg p-3 font-medium transition-colors duration-200 ease-in-out group-hover:bg-gray-100" :class="[route.path === to ? 'bg-gray-100 text-gray-900' : 'text-gray-900']">
    <component :is="icon" class="h-5 w-5" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>
