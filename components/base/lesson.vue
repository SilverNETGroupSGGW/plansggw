<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { OnClickOutside } from '@vueuse/components'
import { Float } from '@headlessui-float/vue'
import type { Subject } from '~/types'
import { SubjectType } from '~/types'

const props = defineProps<Subject>()

const model = defineModel<boolean>({ default: false })

const backgroundClass = computed(() => {
  switch (props.type) {
    case SubjectType.Faculty:
      return 'bg-purple-50 border-purple-600'
    case SubjectType.Laboratories:
      return 'bg-yellow-50 border-yellow-600'
    case SubjectType.Lecture:
      return 'bg-blue-50 border-blue-600'
    case SubjectType.PracticalClasses:
      return 'bg-pink-50 border-pink-600'
    case SubjectType.Unknown:
      return 'bg-gray-50 border-gray-600'
  }
})
</script>

<template>
  <Popover class="relative h-full">
    <Float :show="model" auto-placement :offset="8" enter="transition duration-200 ease-out" enter-from="translate-y-1 opacity-0" enter-to="translate-y-0 opacity-100" leave="transition duration-150 ease-in" leave-from="translate-y-0 opacity-100" leave-to="translate-y-1 opacity-0">
      <PopoverButton :id="id" class="flex h-full w-full flex-col items-start rounded-md border p-4 outline-none" :class="[{ 'opacity-50': ghost }, backgroundClass]">
        <small class="text-xs text-gray-600">
          {{ startTime }} ({{ duration }})
        </small>
        <p class="text-left text-sm font-bold text-gray-900">
          {{ name }}
        </p>
        <small class="mb-2 text-xs text-gray-700">
          {{ type }}
        </small>

        <small v-if="lecturers" class="text-xs text-gray-700">
          <b>{{ lecturers[0].academicDegree }} {{ lecturers[0].firstName }} {{ lecturers[0].surname }}</b>
        </small>
        <small class="text-xs text-gray-700">
          <b>Sala: </b> b. {{ classroom?.building }}, p. {{ classroom?.floor }}, s. {{ classroom?.name }}
        </small>
        <small v-if="groups" class="text-xs text-gray-700">
          <b>Grupy: </b> {{ groups.map(x => x.name).join(', ') }}
        </small>
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
