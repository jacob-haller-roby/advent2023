import readFile from "./utils/readFile";
const start = performance.now();

const inputData = await readFile('day1.txt');

const getDigits = (row: string): string[] => {
  return [
    ...row.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine|zero))/g)
    ].map(result => result[1]);
}

const CharNumberMap = {
    0:0,
    1:1,
    2:2,
    3:3,
    4:4,
    5:5,
    6:6,
    7:7,
    8:8,
    9:9,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    zero: 0
  };

const result = inputData.split('\n')
  .map(getDigits)
  .map(digits => [
    CharNumberMap[digits[0]],
    CharNumberMap[digits[digits.length - 1]]
  ])
  .map(digits => digits[0] * 10 + digits[1])
  .reduce((acc, cur) => acc + cur, 0);

const end = performance.now();

console.log(`The result is: ${result}`);
console.log(`Runtime was: ${(end - start).toFixed(0)}ms`)