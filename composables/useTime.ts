export default function useTime() {
  function generateTimeInterval(start: Date, end: Date, step: number) {
    const result = []
    let current = new Date(start)
    while (current < end) {
      for (let i = 0; i < 2; i++) {
        result.push(current)
        result.push(new Date(current.getTime() + step * 60000))

        current = new Date(current.getTime() + step * 60000)
      }
    }

    return result
  }

  return {
    generateTimeInterval,
  }
}
