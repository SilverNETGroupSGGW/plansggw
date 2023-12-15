<script setup lang="ts">
import { Bars3CenterLeftIcon, ChatBubbleOvalLeftEllipsisIcon, PencilIcon, UserIcon } from '@heroicons/vue/24/outline'

const tabs = reactive([
  {
    icon: Bars3CenterLeftIcon,
    label: 'Plany zajęć',
    to: '/plans',
  },
  {
    icon: UserIcon,
    label: 'Wykładowcy',
    to: '/lecturers',
  },
  {
    icon: ChatBubbleOvalLeftEllipsisIcon,
    label: 'Sale wykładowe',
    to: '/rooms',
  },
  {
    icon: PencilIcon,
    label: 'Przedmioty',
    to: '/courses',
  },
])
</script>

<template>
  <aside class="h-[100dvh] w-96 border-r-2 border-gray-700 bg-gray-900 py-9 pl-7 pr-3">
    <logo class="mb-12" />
    <small class="mb-4 block text-sm font-semibold text-blue-400">Panel główny</small>
    <ul>
      <li v-for="tab in tabs" :key="tab.label" class="group mb-2 group-hover:mb-4">
        <base-tab v-bind="tab" />
      </li>
    </ul>
  </aside>
</template>
