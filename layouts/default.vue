<script setup lang="ts">
const { start } = useLoadingIndicator()
start()
</script>

<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <div class="flex">
    <layout-sidebar />

    <main class="h-screen w-full overflow-y-scroll">
      <slot />
    </main>

    <aside id="aside-right" class="flex items-center border-l p-9" />
  </div>
</template>
