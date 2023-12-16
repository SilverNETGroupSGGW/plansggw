import { faker } from '@faker-js/faker'

interface Lecturer {
  id: number
  degree: string
  name: string
  faculty: string
}

export const useLecturers = defineStore('lecturers', {
  state: () => ({
    search: '',
    data: [] as Lecturer[],
    columns: [
      {
        key: 'degree',
        header: 'Stopień naukowy',
      },
      {
        key: 'name',
        header: 'Imię i nazwisko',
      },
      {
        key: 'actions',
        header: 'Akcje',
      },
    ],
  }),
  getters: {
    getById: state => (id: number) => {
      const result = state.data.find(item => item.id === id)
      if (!result)
        return null

      return result
    },
  },
  actions: {
    create(data: Lecturer) {
      this.data.push(data)
    },
    dispatch() {
      let index = 0

      this.data = faker.helpers.multiple(() => ({
        id: index++,
        degree: faker.person.jobTitle(),
        name: faker.person.fullName(),
        faculty: faker.person.jobArea(),
      } as Lecturer), { count: 10 })
    },
    delete(id: number) {
      this.data.splice(this.data.findIndex(item => item.id === id), 1)
    },
    filter(row: Lecturer) {
      return Object.values(row).some((value) => {
        return String(value).toLowerCase().includes(this.search.toLowerCase())
      })
    },
    update(id: number, data: Lecturer) {
      const index = this.data.findIndex(item => item.id === id)
      if (index === -1)
        return

      this.data[index] = data
    },
  },
})
