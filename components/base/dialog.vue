<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import type { FunctionalComponent } from 'vue'

defineProps<{
  modelValue: boolean
  icon: FunctionalComponent
  title: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative z-10" @close="$emit('update:modelValue', false)">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-lg overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <div class="flex items-center justify-between border border-b-gray-200 bg-gray-50 p-6">
                <div class="flex items-center gap-2 text-gray-900">
                  <component :is="icon" class="h-5 w-5" />
                  <DialogTitle as="h3" class="text-lg font-medium">
                    {{ title }}
                  </DialogTitle>
                </div>
                <XMarkIcon class="h-6 w-6 cursor-pointer text-gray-400" @click="$emit('update:modelValue', false)" />
              </div>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
