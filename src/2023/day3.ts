import runTest from "../utils/runTest";
import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day3.txt');
// Array of possible PartNumbers
interface PartNumber {
  id: number,
  location: NumberLocation
}
interface NumberLocation {
  xStart: number,
  xEnd: number,
  y: number
}

// Map of symbol locations
type SymbolMapRow = boolean[];
type SymbolMap = SymbolMapRow[];

type GearMapRow = (null | PartNumber[])[];
type GearMap = GearMapRow[];

const parseRowPartNumbers = (row: string, rowIndex: number): PartNumber[] =>
  [...row.matchAll(/\d+/g)]
    .map(match => {
      const [number] = match;
      const { index } = match;
      const width = number.length;
      return {
        id: Number(number),
        location: {
          xStart: index,
          xEnd: index + width - 1,
          y: rowIndex
        }
      }
    });

const parseRowSymbols = (row: string): SymbolMapRow =>
  [...row.matchAll(/[^\d|\.]/g)]
    .reduce((acc, cur) => {
      acc[cur.index] = true;
      return acc;
    }, Array(row.length).fill(false))

const parseRowGearSymbols = (row: string): GearMapRow =>
  [...row.matchAll(/\*/g)]
    .reduce((acc, cur) => {
      acc[cur.index] = [];
      return acc;
    }, Array(row.length).fill(null))

const makeIsValidPartNumber = (symbolMap: SymbolMap) =>
  (partNumber: PartNumber): boolean => {
    const yStart = Math.max(partNumber.location.y - 1, 0);
    const yEnd = partNumber.location.y + 2;
    const xStart = Math.max(partNumber.location.xStart - 1, 0);
    const xEnd = Math.min(partNumber.location.xEnd + 1, symbolMap[0].length - 1) + 1;

    return symbolMap
      .slice(yStart, yEnd)
      .flatMap(symbolMapRow => symbolMapRow.slice(xStart, xEnd))
      .some(isSymbol => isSymbol)

  }

const partNumberToGearMapReducer = (gearMap: GearMap, partNumber: PartNumber): GearMap => {
  const xStart = Math.max(partNumber.location.xStart - 1, 0);
  const xEnd = Math.min(partNumber.location.xEnd + 1, gearMap[0].length - 1) + 1;
  const yStart = Math.max(partNumber.location.y - 1, 0);
  const yEnd = Math.min(partNumber.location.y + 1, gearMap.length -1) + 1;

  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      gearMap[y][x]?.push(partNumber);
    }
  }
  return gearMap;
}


// PART 1
const sumOfPartNumbers = async () => {
  const rows = dataInput.split('\n');

  const symbolMap: SymbolMap = rows.map(parseRowSymbols);
  const isValidPartNumber = makeIsValidPartNumber(symbolMap);

  return rows
    .flatMap(parseRowPartNumbers)
    .filter(isValidPartNumber)
    .map(partNumber => partNumber.id)
    .reduce((acc, cur) => acc + cur, 0);
}

// PART 2
const sumOfGears = async () => {
  const rows = dataInput.split('\n');

  const gearMap: GearMap = rows.map(parseRowGearSymbols);

  return rows
    .flatMap(parseRowPartNumbers)
    .reduce(partNumberToGearMapReducer, gearMap)
    .flat()
    .filter(partNumbers => partNumbers !== null)
    .filter(partNumbers => partNumbers.length === 2)
    .map(partNumbers => partNumbers.reduce((acc, cur) => acc * cur.id, 1))
    .reduce((acc, cur) => acc + cur, 0)
}

await runMetricsTest(sumOfPartNumbers, 'Part 1');
await runMetricsTest(sumOfGears, 'Part 2');