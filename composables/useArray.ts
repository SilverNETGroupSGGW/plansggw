export default function useArray<T>() {
  function* chunk(array: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < array.length; i += n)
      yield array.slice(i, i + n)
  }

  return {
    chunk,
  }
}
