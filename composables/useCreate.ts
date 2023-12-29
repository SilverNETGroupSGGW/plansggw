// import type { Subject } from '~/types'

// export default function useCreate(subjects: Subject[], container: Ref<HTMLElement | null>, groupCells: Ref<HTMLElement[]>) {
//   const mouse = useMouse()

//   const { onResizeDown } = useResize(subjects, container, groupCells)

//   function onCreateMove(event: PointerEvent) {
//     if (event.button !== 0)
//       return

//     const target = event.target as HTMLElement

//     // Prevent creating a new subject when clicking on an existing subject
//     if (target.id.startsWith('subject-'))
//       return

//     let x = Math.round((event.clientX - container.value!.getBoundingClientRect().left - 24 + 12) / 24) * 24
//     let y = Math.round((event.clientY - container.value!.getBoundingClientRect().top - groupCells.value[0].offsetHeight + 12) / groupCells.value[0].offsetHeight) * groupCells.value[0].offsetHeight

//     // Check if x or y is outside the bounds and set them to the closest boundary
//     const containerRect = container.value!.getBoundingClientRect()
//     if (x < 0)
//       x = 0
//     if (y < 0)
//       y = 0
//     if (x > containerRect.width - 24)
//       x = containerRect.width - 24
//     if (y > containerRect.height - groupCells.value[0].offsetHeight)
//       y = containerRect.height - groupCells.value[0].offsetHeight

//     const newSubject: Subject = {
//       x,
//       y,
//       width: 24,
//       height: groupCells.value[0].offsetHeight,
//       start: new Date(),
//       end: new Date(),
//       ghost: true,
//     }
//     mouse.resizeEdge = 'bottom-right'
//     mouse.currentSubject = newSubject

//     // Add the new subject to the subjects array
//     subjects.push(newSubject)

//     // Trigger the resize event
//     onResizeDown(event, newSubject, true)
//   }

//   return {
//     onCreateMove,
//   }
// }
