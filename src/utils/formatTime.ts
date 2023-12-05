import leftPad from "./leftPad";

export default (ms: number, padSize?: number) => {
  if (ms < 1) {
    return leftPad((ms * 1000).toFixed(0) + ' µs', padSize)
  }
  return leftPad(ms.toFixed(2) + ' ms', padSize)
}
