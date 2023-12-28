import type { Lecture } from '~/types'

export const useMouse = defineStore('mouse', {
  state: () => ({
    resizeEdge: null as null | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom',
    currentLecture: null as null | Lecture,
  }),
})
