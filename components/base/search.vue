<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions, TransitionRoot } from '@headlessui/vue'

const props = defineProps<{
  modelValue: string | number
  options: any[]
  icon?: /* FunctionalComponent */ any
  label?: string
  caption?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const query = ref('')

const filteredOptions = computed(() => {
  return props.options.filter((option) => {
    if (!query.value)
      return true

    return option.toLowerCase().includes(query.value.toLowerCase())
  })
})
</script>

<template>
  <div class="relative flex flex-col">
    <Combobox :model-value="modelValue" v-bind="$attrs" @update:model-value="$emit('update:modelValue', $event)">
      <ComboboxLabel v-if="label" class="mb-1 font-medium text-gray-700">
        {{ label }}
      </ComboboxLabel>
      <div class="relative h-full">
        <component :is="icon" v-if="icon" class="absolute left-6 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
        <ComboboxInput class="flex h-12 flex-col items-start justify-center self-stretch rounded-lg border border-gray-300 py-4 pr-6 text-gray-700 transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:transition-all hover:duration-200 hover:ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:transition-all focus:duration-200 focus:ease-in-out active:ring-2 active:ring-blue-600 disabled:bg-gray-100" v-bind="$attrs" :class="[icon ? 'pl-12' : 'pl-6']" @change="query = $event.target.value" />

        <TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" @after-leave="query = ''">
          <ComboboxOptions class="absolute mt-4 max-h-60 w-fit overflow-auto rounded-lg border border-gray-200 bg-white px-1 py-2 text-base focus:outline-none">
            <ComboboxOption v-for="option in filteredOptions" :key="option" v-slot="{ active }" as="template" :value="option">
              <li
                class="relative cursor-default select-none rounded-lg px-5 py-2" :class="{
                  'bg-blue-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span class="block truncate">{{ option }}</span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
