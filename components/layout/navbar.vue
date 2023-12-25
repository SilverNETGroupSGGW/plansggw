<template>
  <nav class="flex h-16 w-full flex-wrap justify-between gap-4 border border-b-gray-200 bg-white px-7">
    <div class="flex items-center gap-4">
      <logo />
      <div>
        <h1 class="text-xl font-semibold leading-9 text-gray-900">
          Plan SGGW<br>
        </h1>
        <p class="text-base font-normal leading-normal text-gray-700">
          <slot name="subtitle" />
        </p>
      </div>
    </div>

    <slot name="aside" />
  </nav>
</template>
