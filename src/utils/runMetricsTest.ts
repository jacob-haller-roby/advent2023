import formatTime from "./formatTime";

export default async (test: () => Promise<number> | number, label?: string) => {

  const start = performance.now();
  const result = await test();
  const end = performance.now();
  const firstRun = end - start;

  const timings: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const start = performance.now();
    await test();
    const end = performance.now();
    timings.push(end-start);
  }
  console.log(`\nTest results${label ? ` for ${label}` : ''}:`)
  console.log(`The result is: ${result}`);
  console.log(`First run took: ${formatTime(firstRun)}`)
  console.log(`Average runtime was: ${formatTime(getAverage(timings))}`)
  console.log(`Std Dev was: ${formatTime(getStandardDeviation(timings))}`)
}

const getStandardDeviation = (values: number[]) => {
  const n = values.length
  const mean = values.reduce((a, b) => a + b) / n
  return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const getAverage = (values: number[]) => {
  return values.reduce((acc, cur) => acc + cur, 0) / values.length;
}

