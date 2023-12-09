import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";


const dataInput = await readFile('day9.txt');
const part1 = () => {
  return dataInput.split('\n')
    .map(parseRow)
    .map(extrapolateRow)
    .reduce((acc, cur) => acc + cur, 0);
}

const part2 = () => {
  return dataInput.split('\n')
    .map(parseRow)
    .map(extrapolateBackwardsRow)
    .reduce((acc, cur) => acc + cur, 0);
}

const parseRow = (row: string) => {
  const numbers = row.split(' ')
    .map(numberString => Number(numberString))
  return recursiveFindDiffs(numbers);
}

const recursiveFindDiffs = (values: number[]): number[][] => {
  if (values.every(value => value === 0)) return [values];
  const diffs = [];
  for (let i = 0; i < values.length - 1; i++) {
    diffs.push(values[i + 1] - values[i]);
  }
  return [values, ...recursiveFindDiffs(diffs)]
}

const extrapolateRow = (diffCollections: number[][]): number => {
  if (diffCollections.length === 1) return 0;
  return diffCollections[0][diffCollections[0].length - 1] + extrapolateRow(diffCollections.slice(1));
}

const extrapolateBackwardsRow = (diffCollections: number[][]): number => {
  if (diffCollections.length === 1) return 0;
  return diffCollections[0][0] - extrapolateBackwardsRow(diffCollections.slice(1));
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');
