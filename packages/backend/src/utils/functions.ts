/* eslint-disable no-param-reassign */

export function generateString(length): string {
  let result = ''

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  const charactersLength = characters.length

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export function arrayElementMove(
  array: [],
  oldIndex: number,
  newIndex: number
): [] {
  while (oldIndex < 0) {
    oldIndex += array.length
  }

  while (newIndex < 0) {
    newIndex += array.length
  }

  if (newIndex >= array.length) {
    let k = newIndex - array.length + 1

    // eslint-disable-next-line no-plusplus
    while (k--) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      array.push(undefined)
    }
  }

  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])

  return array
}
