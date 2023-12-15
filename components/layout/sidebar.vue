<script setup lang="ts">
import { Bars3CenterLeftIcon, ChatBubbleOvalLeftEllipsisIcon, PencilIcon, UserIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <aside class="h-[100dvh] w-96 border-r-2 border-gray-700 bg-gray-900 pl-7 pr-3 py-9">
    <logo class="mb-12" />
    <small class="mb-4 block text-sm font-semibold text-blue-400">Panel główny</small>
    <ul>
      <li class="group mb-2 group-hover:mb-4">
        <button class="-mx-3 flex w-full items-center gap-3 rounded-lg p-3 font-medium text-gray-100 transition-colors duration-200 ease-in-out group-hover:bg-gray-800 group-hover:text-blue-400">
          <Bars3CenterLeftIcon class="h-5 w-5" />
          <span>Plany zajęć</span>
        </button>
      </li>
      <li class="group mb-2 group-hover:mb-4">
        <button class="-mx-3 flex w-full items-center gap-3 rounded-lg p-3 font-medium text-gray-100 transition-colors duration-200 ease-in-out group-hover:bg-gray-800 group-hover:text-blue-400">
          <UserIcon class="h-5 w-5" />
          <span>Wykładowcy</span>
        </button>
      </li>
      <li class="group mb-2 group-hover:mb-4">
        <button class="-mx-3 flex w-full items-center gap-3 rounded-lg p-3 font-medium text-gray-100 transition-colors duration-200 ease-in-out group-hover:bg-gray-800 group-hover:text-blue-400">
          <ChatBubbleOvalLeftEllipsisIcon class="h-5 w-5" />
          <span>Sale wykładowe</span>
        </button>
      </li>
      <li class="group">
        <button class="-mx-3 flex w-full items-center gap-3 rounded-lg p-3 font-medium text-gray-100 transition-colors duration-200 ease-in-out group-hover:bg-gray-800 group-hover:text-blue-400">
          <PencilIcon class="h-5 w-5" />
          <span>Przedmioty</span>
        </button>
      </li>
    </ul>
  </aside>
</template>
