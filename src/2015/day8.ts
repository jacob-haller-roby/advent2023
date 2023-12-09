import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day8.txt', 2015);
const part1 = () => {
  return dataInput.split('\n')
    .map(row =>
      [...row.matchAll(/(\\x)|(\\\\)|(\\")/g)]
        .map(match => match[0])
        .map(escape => ({
          '\\\\': 1,
          '\\"': 1,
          '\\x': 3
        })[escape])
        .reduce((acc, cur) => acc + cur, 0)
    )
    .map(encodings => encodings + 2)
    .reduce((acc, cur) => acc + cur, 0);
}

const part2 = () => {
  return dataInput.split('\n')
    .map(row =>
      [...row.matchAll(/["\\]/g)].length
    )
    .map(encodings => encodings + 2)
    .reduce((acc, cur) => acc + cur, 0);
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');