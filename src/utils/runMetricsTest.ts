import formatTime from "./formatTime";
import 'colors';
import leftPad from "./leftPad";

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

  const padLength = Math.max(result.toString().length, 8);
  console.log(`\nTest results${label ? ` for ${label.blue}` : ''}:`.underline)
  console.log(`Answer:           ${leftPad(result.toString(), padLength).magenta}`);
  console.log(`First Runtime:    ${formatTime(firstRun, padLength).yellow}`)
  console.log(`Average Runtime:  ${formatTime(getAverage(timings), padLength).yellow}`)
  console.log(`Std Dev:          ${formatTime(getStandardDeviation(timings), padLength, '±').yellow}`)
}

const getStandardDeviation = (values: number[]) => {
  const n = values.length
  const mean = values.reduce((a, b) => a + b) / n
  return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const getAverage = (values: number[]) => {
  return values.reduce((acc, cur) => acc + cur, 0) / values.length;
}

