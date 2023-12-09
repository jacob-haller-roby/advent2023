import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day5.txt', 2015);

type Pair = [string, string];
const part1 = () =>
  dataInput.split('\n')
    .filter(hasThreeVowels)
    .map(wordToPairs)
    .filter(hasDoubleLetter)
    .filter(not(hasBlacklistPair))
    .length


const hasThreeVowels = (word: string): boolean =>
  (word.match(/[a|e|i|o|u]/g) || []).length >= 3

const wordToPairs = (word: string): Pair[] => {
  const result: Pair[] = [];
  for (let i = 0; i < word.length - 1; i++) {
    result.push([word[i], word[i + 1]])
  }
  return result;
}

const hasDoubleLetter = (pairings: Pair[]): boolean =>
  pairings.some(pair => pair[0] === pair[1]);

const BlacklistPairs = [
  ['a', 'b'],
  ['c', 'd'],
  ['p', 'q'],
  ['x', 'y']
]

const hasBlacklistPair = (pairings: Pair[]): boolean =>
  pairings.some(pair => BlacklistPairs.some(bl => bl[0] === pair[0] && bl[1] === pair[1]))

const not = <T>(fn: (arg: T) => boolean) => (arg: T) => !fn(arg);

// aba regex: (\S).\1
// abcdeab regex: (\S{2}).{0,}\1
const part2 = () => {
  return dataInput
    .split("\n")
    .filter(row => row.match(/(\S).\1/g))
    .filter(row => row.match(/(\S{2}).{0,}\1/g))
    .length
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');