export default (ms: number) => {
  if (ms < 1) {
    return (ms * 1000).toFixed(0) + 'µs'
  }
  return ms.toFixed(2) + 'ms'
}