import leftPad from "./leftPad";

export default (ms: number, padSize: number = 0, prefix: string = '') => {
  if (ms < 1) {
    return leftPad(prefix + (ms * 1000).toFixed(0) + ' µs', padSize)
  }
  return leftPad(prefix + ms.toFixed(2) + ' ms', padSize)
}
