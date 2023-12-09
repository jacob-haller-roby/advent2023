import crypto from 'crypto';
import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";
import runTest from "../utils/runTest";

const dataInput = await readFile('day4.txt', 2015);

const part1 = () => {
  for (let i = 0; ; i++) {
    const result = crypto.createHash("md5")
      .update(dataInput + i)
      .digest('hex')
      .slice(0, 5);
    if (result === '00000') {
      return i;
    }

  }
}

const part2 = () => {
  for (let i = 0; ; i++) {
    const result = crypto.createHash("md5")
      .update(dataInput + i)
      .digest('hex')
      .slice(0, 6);
    if (result === '000000') {
      return i;
    }
  }
}

// await runTest(part1, 'Part 1')
// await runMetricsTest(part1, 'Part 1');
await runTest(part2, 'Part 2');