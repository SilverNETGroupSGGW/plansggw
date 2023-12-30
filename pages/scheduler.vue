<script setup lang="ts">
import type { Subject } from '~/types'

// Elements
const container = ref<HTMLDivElement | null>(null)
const groupCells = ref<HTMLDivElement[]>([])
const subjectCells = ref<HTMLDivElement[] | null>(null)

// Time range
const timeRange: Date[] = []
const initialDate = new Date(2023, 0, 1, 8, 0, 0, 0)

while (initialDate.getHours() < 20) {
  timeRange.push(new Date(initialDate.getTime()))
  initialDate.setMinutes(initialDate.getMinutes() + 30)
}

// Composables
const { calculatePosition } = useSubject()

// Subjects
const groups = ['efe04f87-3d7d-46f8-9cc1-0852564be8fa']
const subjects = ref<Subject[]>([])

const { data } = await useFetch<Subject[]>('Subjects', {
  baseURL: 'https://kampus-sggw-api.azurewebsites.net/api',
})

if (data.value) {
  subjects.value = data.value.map((subject) => {
    const { x, y, width, height } = calculatePosition(subject, 139.25, groups)
    return { ...subject, x, y, width, height }
  })
}

// Hooks
const { onPointerDown } = useResize(subjects.value, container, groupCells)
</script>

<template>
  <div class="h-full select-none overflow-x-scroll">
    <div class="flex w-full flex-col">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex h-12 w-[7.5rem] shrink-0" />
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-12 w-36 shrink-0 items-center justify-between whitespace-nowrap text-center font-medium text-gray-700">
            <div>{{ time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
          </div>
        </div>

        <div class="flex">
          <div class="flex h-12 w-36 shrink-0 border-r-2" />
          <div v-for="index in timeRange.length * 6" v-once :key="index" class="flex h-12 w-6 shrink-0 items-center justify-between whitespace-nowrap border-b border-r border-gray-200 text-center font-medium text-gray-700" :class="[index % 6 === 0 ? 'border-r-2' : 'border-r']" />
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-175px)]">
      <div class="flex h-full w-fit flex-col">
        <div v-for="group in groups" v-once :id="group" ref="groupCells" :key="group" :style="{ height: `${100 / groups.length}%` }" class="flex w-36 shrink-0 items-center justify-center border-r-2 border-t border-gray-200 text-center text-xs text-gray-700">
          {{ group }}
        </div>
      </div>

      <div ref="container" class="relative flex flex-col">
        <div v-for="(subject, index) in subjects" ref="subjectCells" :key="index" :style="{ transform: `translate(${subject.x}px, ${subject.y}px)`, width: `${subject.width}px`, height: `${subject.height}px`, zIndex: subject.overlap ? subject.zIndex! : undefined }" class="absolute pb-0.5 pr-0.5 hover:cursor-move" @pointerdown.prevent="onPointerDown($event, subject)">
          <div :id="subject.id" class="flex h-full flex-col gap-2 rounded-md bg-blue-700 p-4" :class="[{ 'opacity-50': subject.ghost, 'border-2 border-white': subject.overlap }]" :style="{ zIndex: subject.overlap ? 1 : 0 }">
            <div :id="subject.id" class="flex flex-col gap-1">
              <span class="font-bold text-white">{{ subject.name }}</span>
              <span class="text-white">{{ subject.type }}</span>
              <span class="text-white">{{ subject.startTime }} ({{ subject.duration }})</span>
            </div>
          </div>
        </div>

        <div v-for="group in groups" v-once :key="group" class="flex" :style="{ height: `${100 / groups.length}%` }">
          <div v-for="(time, index) in timeRange" v-once :key="index" class="flex h-full w-36 shrink-0 items-center justify-between border-b border-r-2 border-gray-200 text-center text-xs text-gray-700" :data-group="group" :data-time="time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })" />
        </div>
      </div>
    </div>
  </div>
</template>
