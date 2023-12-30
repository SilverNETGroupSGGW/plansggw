import type { Lecturer } from '~/types'

export const useLecturers = defineStore('lecturers', {
  state: () => ({
    search: '',
    data: [] as Lecturer[],
    columns: [
      {
        key: 'academicDegree',
        header: 'Stopień naukowy',
      },
      {
        key: 'firstName',
        header: 'Imię i nazwisko',
      },
      {
        key: 'email',
        header: 'Email',
      },
      {
        key: 'actions',
        header: 'Akcje',
      },
    ],
  }),
  actions: {
    async get() {
      const data = await $fetch<Lecturer[]>('lecturers', {
        baseURL: 'https://kampus-sggw-api.azurewebsites.net/api',
        method: 'GET',
      })

      this.data = data
    },
    async update(lecturer: Lecturer) {
      await $fetch('lecturers', {
        baseURL: 'https://kampus-sggw-api.azurewebsites.net/api',
        method: 'PUT',
        body: JSON.stringify(lecturer),
      })
    }
  },
})
