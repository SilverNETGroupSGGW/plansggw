<script setup lang="ts">
const { start } = useLoadingIndicator()
start()
</script>

<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <layout-navbar />
  <div class="flex">
    <layout-sidebar />

    <main class="h-[calc(100dvh-4rem)] w-full overflow-y-scroll">
      <slot />
    </main>
  </div>
</template>
