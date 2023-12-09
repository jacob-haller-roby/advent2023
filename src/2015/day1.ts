import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day1.txt', 2015);

const part1 = (): number => {
    return dataInput
      .split('')
      .map(char => char === '(' ? 1: -1)
      .reduce((acc, cur) => acc + cur, 0)
}

const part2 = (): number => {

  const moves = dataInput
    .split('')
    .map(char => char === '(' ? 1: -1);
  for (let i = 0, floor = moves[0]; i < moves.length; i++, floor += moves[i]) {
    if (floor < 0) return i+1;
  }
  throw 'Never went to basement';
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');