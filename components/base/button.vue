<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'flat'
  flat?: boolean
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    v-bind="$attrs"
    class="flex cursor-pointer items-center justify-center gap-2 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 active:ring-2"
    :class="{
      'disabled:opacity-50': $attrs.disabled,
      'rounded-lg bg-blue-600 px-4 py-2 text-blue-50 hover:bg-blue-700 focus:ring-blue-700/50 active:ring-blue-700/50': variant === 'primary',
      'rounded-lg bg-gray-50 px-4 py-2 text-gray-600 hover:bg-gray-100 focus:ring-gray-100/50 active:ring-gray-100/50': variant === 'secondary',
      'rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 focus:ring-red-100/50 active:ring-red-100/50': variant === 'danger',
      'rounded-lg bg-green-50 px-4 py-2 text-green-600 hover:bg-green-100 focus:ring-green-100/50 active:ring-green-100/50': variant === 'success',
      'rounded-lg bg-yellow-50 px-4 py-2 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-100/50 active:ring-yellow-100/50': variant === 'warning',
      'bg-transparent': flat,
    }"
  >
    <slot />
  </component>
</template>
