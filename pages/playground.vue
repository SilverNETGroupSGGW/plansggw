<script setup lang="ts">
import { BuildingLibraryIcon } from '@heroicons/vue/24/outline'

const search = ref('')

const institutes = [
  'Instytut Biologii',
  'Instytut Ekonomii i Finansów',
  'Instytut Informatyki Technicznej',
  'Instytut Inżynierii Lądowej',
  'Instytut Inżynierii Mechanicznej',
  'Instytut Inżynierii Środowiska',
  'Instytut Medycyny Weterynaryjnej',
  'Instytut Nauk Drzewnych i Meblarstwa',
  'Instytut Nauk Leśnych',
  'Instytut Nauk Ogrodniczych',
  'Instytut Nauk o Zwierzętach',
  'Instytut Nauk o Żywności',
  'Instytut Nauk o Żywieniu Człowieka',
  'Instytut Nauk Socjologicznych i Pedagogiki',
  'Instytut Rolnictwa',
  'Instytut Zarządzania',
]
</script>

<template>
  <div class="p-16">
    <base-search v-model="search" :icon="BuildingLibraryIcon" label="Search" :options="institutes" />
  </div>
</template>
