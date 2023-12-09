import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";
import runTest from "../utils/runTest";

const dataInput = await readFile('day6.txt', 2015);

interface Instruction {
  action: Action,
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number
}

enum Action {
  ON = 'turn on',
  OFF = 'turn off',
  TOGGLE = 'toggle'
}

enum Status {
  OFF,
  ON
}

const ActionMap: Record<Action, Action> = {
  [Action.ON]: Action.ON,
  [Action.OFF]: Action.OFF,
  [Action.TOGGLE]: Action.TOGGLE
}

const part1 = () => {
  const result = dataInput.split('\n')
    .map(parseRow)
    .reduce(reduceInstructions, createInitialMap())
    .flat()
    .filter(status => status === Status.ON)
    .length
  return result;
}

const createInitialMap = (): Status[][] => {
  const map: Status[][] = [];
  for (let i = 0; i < 1000; i++) {
    map.push(Array(1000).fill(Status.OFF))
  }
  return map;
}

const parseRow = (row: string): Instruction => {
  const action = ActionMap[row.match(/^.*?(?= \d)/g)[0]];
  const [
    xStart,
    yStart,
    xEnd,
    yEnd
  ] =
    [...row.matchAll(/\d+/g)]
      .map(match => Number(match[0]))
  return {
    action,
    xStart,
    yStart,
    xEnd,
    yEnd
  }
}

const reduceInstructions = (map: Status[][], instruction: Instruction): Status[][] => {
  const statusConverter = makeStatusConverter(instruction);
  for (let i = instruction.xStart; i <= instruction.xEnd; i++) {
    for (let j = instruction.yStart; j <= instruction.yEnd; j++) {
      map[i][j] = statusConverter(map[i][j]);
    }
  }
  return map;
}

type StatusConverter = (status: Status) => Status;
const makeStatusConverter = (instruction: Instruction): StatusConverter => {
  return {
    [Action.OFF]: () => Status.OFF,
    [Action.ON]: () => Status.ON,
    [Action.TOGGLE]: (status: Status) => status === Status.ON ? Status.OFF : Status.ON
  }[instruction.action]
}

const part2 = () => {
  const result = dataInput.split('\n')
    .map(parseRow)
    .reduce(reduceGradientInstructions, createInitialGradientMap())
    .flat()
    .reduce((acc, cur) => acc + cur, 0)
  return result;
}


type GradientMap = number[][];
const createInitialGradientMap = (): GradientMap => {
  const map: Status[][] = [];
  for (let i = 0; i < 1000; i++) {
    map.push(Array(1000).fill(0))
  }
  return map;
}

const reduceGradientInstructions = (map: GradientMap, instruction: Instruction): GradientMap => {
  const gradientConverter = makeGradientConverter(instruction);
  for (let i = instruction.xStart; i <= instruction.xEnd; i++) {
    for (let j = instruction.yStart; j <= instruction.yEnd; j++) {
      map[i][j] = gradientConverter(map[i][j]);
    }
  }
  return map;
}

type GradientConverter = (level: number) => number;
const makeGradientConverter = (instruction: Instruction): GradientConverter => {
  return {
    [Action.OFF]: (level: number) => Math.max(level - 1, 0),
    [Action.ON]: (level: number) => level + 1,
    [Action.TOGGLE]: (level: number) => level + 2,
  }[instruction.action]
}

await runTest(part1, 'Part 1')
await runTest(part2, 'Part 2')
