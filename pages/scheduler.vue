<script setup lang="ts">
import type { Lecture } from '~/types'

// Elements
const container = ref<HTMLDivElement | null>(null)
const groupCells = ref<HTMLDivElement[]>([])

// Lectures
const groups = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const lectures = reactive<Lecture[]>([])
const lectureCells = ref<HTMLDivElement[]>([])

// Time range
const timeRange: Date[] = []
const initialDate = new Date(2023, 0, 1, 8, 0, 0, 0)

while (initialDate.getHours() < 20) {
  timeRange.push(new Date(initialDate.getTime()))
  initialDate.setMinutes(initialDate.getMinutes() + 15)
}

const { onPointerDown } = useResize(lectures, container, groupCells)
const { onCreateMove } = useCreate(lectures, container, groupCells)
</script>

<template>
  <div class="h-full overflow-x-scroll">
    <div class="flex w-full flex-col">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex h-12 w-[7.5rem] shrink-0" />
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap text-center font-medium text-gray-700">
            <div>{{ time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
          </div>
        </div>

        <div class="flex">
          <div class="flex h-12 w-36 shrink-0 border-r" />
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap border-b border-r border-gray-200 text-center font-medium text-gray-700" />
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-175px)]">
      <div class="flex h-full w-fit flex-col">
        <div v-for="group in groups" v-once :id="group" ref="groupCells" :key="group" :style="{ height: `${100 / groups.length}%` }" class="flex w-36 shrink-0 items-center justify-center border-r border-t border-gray-200 text-center text-xs text-gray-700">
          {{ group }}
        </div>
      </div>

      <div ref="container" class="relative flex flex-col" @pointerdown.prevent="onCreateMove">
        <div v-for="(lecture, index) in lectures" ref="lectureCells" :key="index" :style="{ transform: `translate(${lecture.x}px, ${lecture.y}px)`, width: `${lecture.width}px`, height: `${lecture.height}px`, zIndex: lecture.overlap ? lecture.zIndex : undefined }" class="absolute pb-0.5 pr-0.5 hover:cursor-move" @pointerdown.prevent="onPointerDown($event, lecture)">
          <div :id="`lecture-${lecture.id?.toString()}`" class="flex h-full flex-col gap-2 rounded-md bg-blue-700 p-4" :class="[{ 'opacity-50': lecture.ghost, 'border-2 border-white': lecture.overlap }]" :style="{ zIndex: lecture.overlap ? 1 : 0 }">
            <div :id="`lecture-${lecture.id?.toString()}`" class="flex flex-col gap-1">
              <span :id="`lecture-${lecture.id?.toString()}`" class="text-sm font-semibold text-white">{{ lecture.group.join(', ') }}</span>
              <span :id="`lecture-${lecture.id?.toString()}`" class="select-none text-xs font-normal text-white">{{ lecture.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ lecture.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
            </div>
          </div>
        </div>

        <div v-for="group in groups" v-once :key="group" class="flex" :style="{ height: `${100 / groups.length}%` }">
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-full w-36 shrink-0 items-center justify-between border-b border-r border-gray-200 text-center text-xs text-gray-700" :data-group="group" :data-time="time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })" />
        </div>
      </div>
    </div>
  </div>
</template>
