<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { OnClickOutside } from '@vueuse/components'
import { Float } from '@headlessui-float/vue'
import type { Subject } from '~/types'

defineProps<Subject>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Popover class="relative h-full">
    <Float :show="model" auto-placement :offset="8" enter="transition duration-200 ease-out" enter-from="translate-y-1 opacity-0" enter-to="translate-y-0 opacity-100" leave="transition duration-150 ease-in" leave-from="translate-y-0 opacity-100" leave-to="translate-y-1 opacity-0">
      <PopoverButton :id="id" class="flex h-full w-full flex-col gap-2 rounded-md bg-blue-700 p-4 outline-none" :class="[{ 'opacity-50': ghost, 'border-2 border-white': overlap }]" :style="{ zIndex: overlap ? 1 : 0 }">
        <div :id="id" class="flex flex-col gap-1">
          <span :id="id" class="font-bold text-white">{{ name }}</span>
          <span :id="id" class="text-white">{{ type }}</span>
          <span :id="id" class="text-white">{{ startTime }} ({{ duration }})</span>
        </div>
      </PopoverButton>

      <PopoverPanel static class="z-10 w-[20rem] max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white">
        <OnClickOutside @trigger="model = !model">
          <div class="flex flex-col gap-4 p-4">
            <div class="flex flex-col gap-2">
              <span class="font-bold text-gray-900">{{ name }}</span>
              <span class="text-gray-900">{{ type }}</span>
              <span class="text-gray-900">{{ startTime }} ({{ duration }})</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-bold text-gray-900">Grupy</span>
              <div class="flex flex-col gap-1">
                <span v-for="group in groupsIds" :key="group" class="text-gray-900">
                  {{ group }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-bold text-gray-900">Sala</span>
              <span class="text-gray-900">{{ classroomId }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-bold text-gray-900">Prowadzący</span>
              <div class="flex flex-col gap-1">
                <span v-for="lecturer in lecturersIds" :key="lecturer" class="text-gray-900">
                  {{ lecturer }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-bold text-gray-900">Komentarz</span>
              <span class="text-gray-900">{{ comment }}</span>
            </div>

            <div class="flex justify-end gap-4">
              <base-button variant="danger">
                Usuń
              </base-button>
              <base-button variant="secondary">
                Zapisz
              </base-button>
            </div>
          </div>
        </OnClickOutside>
      </PopoverPanel>
    </Float>
  </Popover>
</template>
