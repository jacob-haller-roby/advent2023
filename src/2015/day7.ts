import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day7.txt', 2015);

interface Instruction {
  sourceA: string,
  sourceB?: string,
  destination: string,
  operator: Operator
}

enum Operator {
  SET = '',
  AND = 'AND',
  OR = 'OR',
  LSHIFT = 'LSHIFT',
  RSHIFT = 'RSHIFT',
  NOT = 'NOT'
}

const OperatorMap: Record<Operator, Operator> = {
  [Operator.SET]: Operator.SET,
  [Operator.AND]: Operator.AND,
  [Operator.OR]: Operator.OR,
  [Operator.LSHIFT]: Operator.LSHIFT,
  [Operator.RSHIFT]: Operator.RSHIFT,
  [Operator.NOT]: Operator.NOT
}
const stringToOperator = (str: string): Operator => OperatorMap[str];

const part1 = () => {
  const instructions = dataInput.split('\n')
    .map(parseRow);
  const result = processInstructions(instructions);
  return result['a'];
}

const processInstructions = (instructionSource: Instruction[], initialMap: Record<string, number> = {}): Record<string, number> => {
  const instructions = [...instructionSource];
  let result: Record<string, number> = initialMap;
  while (instructions.length) {
    const nextInstruction = instructions.shift();
    if (!canProcessInstruction(result, nextInstruction)) {
      instructions.push(nextInstruction);
      continue;
    }
    result = reduceInstructions(result, nextInstruction);
  }
  return result;
}

const parseRow = (row: string): Instruction => {
  const [input, destination] = row.split(' -> ');
  const inputArray = input.split(' ');
  const operator = getOperatorFromInputArray(inputArray);
  return {
    ...getSourcesFromInputArray(inputArray),
    operator,
    destination
  }
}

const getOperatorFromInputArray = (inputs: string[]): Operator => {
  if (inputs.length === 1) return Operator.SET;
  if (inputs.length === 2) return Operator.NOT;
  return stringToOperator(inputs[1]);
}

const getSourcesFromInputArray = (inputs: string[]): { sourceA: string, sourceB?: string } => {
  if (inputs.length === 2) return {sourceA: inputs[1]};
  return {sourceA: inputs[0], sourceB: inputs[2]}
}

const canProcessInstruction = (map: Record<string, number>, instruction: Instruction): boolean => {
  const isValidA = !Number.isNaN(Number(instruction.sourceA)) ||
    map[instruction.sourceA] !== undefined;
  const isValidB = instruction.sourceB === undefined ||
    !Number.isNaN(Number(instruction.sourceB)) ||
    map[instruction.sourceB] !== undefined;

  return isValidA && isValidB;
}
const reduceInstructions = (map: Record<string, number>, instruction: Instruction): Record<string, number> => {
  const numberSourceA = Number(instruction.sourceA) || map[instruction.sourceA] || 0;
  const numberSourceB = Number(instruction.sourceB) || map[instruction.sourceB] || 0;

  switch (instruction.operator) {
    case Operator.SET:
      map[instruction.destination] = numberSourceA;
      break;
    case Operator.AND:
      map[instruction.destination] = numberSourceA & numberSourceB;
      break;
    case Operator.OR:
      map[instruction.destination] = numberSourceA | numberSourceB;
      break;
    case Operator.LSHIFT:
      map[instruction.destination] = numberSourceA << numberSourceB;
      break;
    case Operator.RSHIFT:
      map[instruction.destination] = numberSourceA >> numberSourceB;
      break;
    case Operator.NOT:
      map[instruction.destination] = numberSourceA ^ 65535;
      break;
    default:
      throw `Unrecognized operator: ${instruction.operator}`
  }
  return map;
}

const part2 = () => {
  const instructions = dataInput.split('\n')
    .map(parseRow);
  const result = processInstructions(instructions);
  const b = result.a;
  const secondInstructions = instructions.filter(instruction => instruction.destination !== 'b');
  const secondResult = processInstructions(secondInstructions, {b});
  return secondResult.a;
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');
