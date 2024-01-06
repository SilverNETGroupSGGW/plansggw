import type { Subject } from '~/types'

export const useSubjects = defineStore('subjects', {
  state: () => ({
    data: null as Subject | null,
  }),
  actions: {
    async get(id: string) {
      const data = await $fetch<Subject[]>(`subjects/${id}/extended`, {
        baseURL: 'https://kampus-sggw-api.azurewebsites.net/api',
        method: 'GET',
      })

      this.data = data
    },
  },
})
