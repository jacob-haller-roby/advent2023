import readFile from "./utils/readFile";
import runMetricsTest from "./utils/runMetricsTest";

const dataInput = await readFile('day6.txt');

interface Race {
  time: number,
  distance: number
}

const part1 = () => {
  return parseData(dataInput)
    .map(getWinnerCount)
    .reduce((acc, cur) => acc * cur, 1);
}

const parseData = (dataString: string): Race[] => {
  const [times, distances] = dataString
    .split('\n')
    .map(row => [
      ...row.matchAll(/\d+/g)
      ]
      .map(match => Number(match[0]))
    )
  return times.map((time, i) => ({
    time: time,
    distance: distances[i]
  }))
}

const getWinnerCount = (race: Race): number => {
  let count = 0;
  for (let i = 0; i < race.time; i++) {
    const distance = i * (race.time - i)
    if (distance > race.distance) count++
  }
  return count;
}

const part2 = (): number => {
  const race = parseBadKerningData(dataInput);
  const highestLoser = findFirstWinner(race) - 1;
  return race.time - (highestLoser * 2) - 1;
}

const parseBadKerningData = (data: string): Race => {
  const [time, distance] = data
    .split('\n')
    .map(row =>
      Number(
        [...row.matchAll(/\d+/g)]
        .map(match => match[0])
        .join('')
      )
    );
  return { time, distance }
}

const findFirstWinner = (race: Race): number => {
  for (let i = 0; i < race.time; i++) {
    const distance = i * (race.time - i)
    if (distance > race.distance) return i;
  }
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');