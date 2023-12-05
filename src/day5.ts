import readFile from "./utils/readFile";
import runMetricsTest from "./utils/runMetricsTest";

const dataInput = await readFile('day5.txt');

interface MapEntry {
  target: number,
  source: number,
  range: number
}
interface Range {
  start: number,
  end: number
}

const part1 = (): number => {
  const [seedString, ...mapStrings] = dataInput.split('\n\n');

  const maps = mapStrings
    .map(parseMap);

  return Math.min(
    ...[
      ...seedString.split(':')[1].matchAll(/\d+/g)
    ]
    .map(match => Number(match[0]))
    .map(seed => maps.reduce(mapReducer, seed))
  );
}

const parseMap = (mapString: string): MapEntry[] =>
  mapString.split('\n')
    .map(row =>
      [...row.matchAll(/\d+/g)]
        .map(match => Number([match]))
    )
    .filter(parsedRow => parsedRow.length !== 0)
    .map(([target, source, range]) => ({target, source, range}));

const mapReducer = (currentId: number, map: MapEntry[]): number => {
  const entry = map.find(entry => entry.source <= currentId && entry.source + entry.range > currentId);
  if (!entry) return currentId;
  return entry.target - entry.source + currentId;
}

const part2 = () => {
  const [seedString, ...mapStrings] = dataInput.split('\n\n');
  const seeds = parseSeedsToEntries(seedString);
  const maps = mapStrings.map(parseMap)
  const upperLimit = findUpperLimit(maps.flat(), seeds);

  return Math.min(
    ...maps
    .map(makeExpandMap(upperLimit))
    .reduce(mapRangeReducer, seeds)
    .map(range => range.start)
  );
}

const parseSeedsToEntries = (seedString: string): Range[] =>
  [
    ...seedString.split(':')[1].matchAll(/\d+ \d+/g)
  ]
    .map(match => match[0].split(' ').map(n => Number(n)))
    .map(rangeArray => ({
      start: rangeArray[0],
      end: rangeArray[0] + rangeArray[1]
    }))


const mapRangeReducer = (ranges: Range[], map: MapEntry[]): Range[] =>
  ranges
    .flatMap(range =>
      map
        .map(entry => {
          const start = Math.max(entry.source, range.start);
          const end = Math.min(entry.source + entry.range, range.end)
          const offset = entry.target - entry.source;
          return {
            start: start + offset,
            end: end + offset
          }
        })
        .filter(range => range.start <= range.end)
    );

// extend map to cover entire range, inserting `source = target` entries for uncovered areas
const makeExpandMap = (upperLimit: number) => (map: MapEntry[]): MapEntry[] => {
  return map.reduce((ranges: Range[], mapEntry: MapEntry) => {
      const mapRange: Range = {
        start: mapEntry.source,
        end: mapEntry.source + mapEntry.range
      }
      return ranges.flatMap(range => {
        // external
        if (
          mapRange.start >= range.end ||
          mapRange.end <= range.start
        ) {
          return [range];
        }

        // fully covered
        if (
          mapRange.start <= range.start &&
          mapRange.end >= range.end
        ) {
          return [];
        }

        // fully internal
        if (
          mapRange.start > range.start &&
          mapRange.end < range.end
        ) {
          return [
            {
              start: range.start,
              end: mapRange.start
            },
            {
              start: mapRange.end + 1,
              end: range.end
            }
          ]
        }

        // half intersect below
        if (mapRange.start < range.start) {
          return [{
            start: mapRange.end,
            end: range.end
          }]
        }

        // half intersect above
        return [{
          start: range.start,
          end: mapRange.start
        }]
      });
    }, [{start: 0, end: upperLimit}])
    .map(range => ({
      target: range.start,
      source: range.start,
      range: range.end - range.start
    }))
    .filter(mapEntry => mapEntry.range)
    .concat(map)
}

const findUpperLimit = (mapEntries: MapEntry[], seeds: Range[]): number => {

  const mapUpperLimit = mapEntries.reduce((max, entry) => {
    const maxEntrySource = entry.source + entry.range;
    const maxEntryTarget = entry.target + entry.range;
    return Math.max(max, maxEntrySource, maxEntryTarget);
  }, 0);

  const seedUpperLimit = seeds.reduce((max, seed) => {
    return Math.max(max, seed.end);
  }, 0);

  return Math.max(mapUpperLimit, seedUpperLimit);
}

await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');