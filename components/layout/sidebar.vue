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
    to: '/classrooms',
  },
  {
    icon: PencilIcon,
    label: 'Przedmioty',
    to: '/courses',
  },
])
</script>

<template>
  <aside class="h-[calc(100dvh-4rem)] w-80 border-r py-9 pl-7 pr-3">
    <small class="mb-4 block text-sm font-semibold text-gray-900">Panel główny</small>
    <ul>
      <li v-for="tab in tabs" :key="tab.label" class="group mb-2 group-hover:mb-4">
        <base-tab v-bind="tab" />
      </li>
    </ul>
  </aside>
</template>
