import { expect, it } from 'vitest'
import useLecture from './utils/useLecture'
import type { Lecture } from './types'

it('useLecturers 1', () => {
  const lecture: Lecture = {
    start: new Date(2021, 1, 1, 8, 0),
    end: new Date(2021, 1, 1, 8, 45),
    group: ['ISI-1', 'ISI-2', 'ISK', 'TM'],
  }

  const cellHeight = 61.89

  const { calculatePosition } = useLecture()
  const position = calculatePosition(lecture, cellHeight, ['ISI-1', 'ISI-2', 'ISK', 'TM'])

  expect(position).toEqual({
    x: 0,
    y: 0,
    width: 432,
    height: 61.89 * 4,
  })
})

it('useLecturers 2', () => {
  const lecture: Lecture = {
    start: new Date(2021, 1, 1, 9, 0),
    end: new Date(2021, 1, 1, 9, 45),
    group: ['ISI-1', 'ISI-2', 'ISK', 'TM'],
  }

  const cellHeight = 61.89

  const { calculatePosition } = useLecture()
  const position = calculatePosition(lecture, cellHeight, ['ISI-1', 'ISI-2', 'ISK', 'TM'])

  expect(position).toEqual({
    x: 576,
    y: 0,
    width: 432,
    height: 61.89 * 4,
  })
})

it('useLecturers 3', () => {
  const lecture: Lecture = {
    start: new Date(2021, 1, 1, 8, 0),
    end: new Date(2021, 1, 1, 9, 45),
    group: ['ISI-1', 'ISI-2', 'ISK', 'TM'],
  }

  const cellHeight = 61.89

  const { calculatePosition } = useLecture()
  const position = calculatePosition(lecture, cellHeight, ['ISI-1', 'ISI-2', 'ISK', 'TM'])

  expect(position).toEqual({
    x: 0,
    y: 0,
    width: 1008,
    height: 61.89 * 4,
  })
})

it('useLecturers 4', () => {
  const lecture: Lecture = {
    start: new Date(2021, 1, 1, 10, 0),
    end: new Date(2021, 1, 1, 10, 45),
    group: ['ISK', 'TM'],
  }

  const cellHeight = 139.25

  const { calculatePosition } = useLecture()
  const position = calculatePosition(lecture, cellHeight, ['ISI-1', 'ISI-2', 'ISK', 'TM'])

  expect(position).toEqual({
    x: 1152,
    y: 278,
    width: 432,
    height: 278,
  })
})
