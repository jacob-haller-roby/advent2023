import runMetricsTest from "../utils/runMetricsTest";
import readFile from "../utils/readFile";

const dataInput = await readFile('day2.txt', 2015);

interface Present {
  l: number,
  w: number,
  h: number
}

const part1 = (): number =>
  parseData(dataInput)
    .map(calculatePaper)
    .reduce((acc, cur) => acc + cur, 0)

const parseData = (data: string): Present[] =>
  data.split('\n')
    .map(row =>
      [...row.matchAll(/\d+/g)]
        .map(match => Number(match[0]))
    )
    .map(([l, w, h]) => ({l, w, h}))

const calculatePaper = (present: Present): number => {
  const sides = [
    present.l * present.h,
    present.l * present.w,
    present.h * present.w
  ]

  return sides
    .map(side => side * 2)
    .reduce(
      (acc, cur) => acc + cur,
      Math.min(...sides)
    );
}

const part2 = (): number =>
  parseData(dataInput)
    .map(calculateRibbon)
    .reduce((acc, cur) => acc + cur, 0)

const calculateRibbon = (present: Present): number => {
  const perimeter =
    (
      present.l + present.h + present.w
      - Math.max(present.l, present.h, present.w)
    ) * 2;
  const bow = present.h * present.l * present.w;
  return perimeter + bow;
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');