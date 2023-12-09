import readFile from "../utils/readFile";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day3.txt', 2015);

interface Coordinate {
  x: number,
  y: number
}

type CoordinateHash = string;

class PresentMap {
  constructor() {
    this.visit({x: 0, y: 0});
  }

  map: Record<CoordinateHash, number> = {};
  private hashCoordinate = (coordinate: Coordinate): CoordinateHash => coordinate.x + '-' + coordinate.y;
  visit = (coordinate: Coordinate) =>
    this.map[this.hashCoordinate(coordinate)] = (this.map[this.hashCoordinate(coordinate)] || 0) + 1

  get = (coordinate: Coordinate) => this.map[this.hashCoordinate(coordinate)];

  getAll = () => Object.values(this.map);
}

const movementToCoordinatesReducer = (coordinates: Coordinate[], movement: string): Coordinate[] => {
  const lastCoordinate = coordinates[coordinates.length - 1];
  switch (movement) {
    case '<':
      coordinates.push({x: lastCoordinate.x - 1, y: lastCoordinate.y});
      break;
    case '>':
      coordinates.push({x: lastCoordinate.x + 1, y: lastCoordinate.y});
      break;
    case 'v':
      coordinates.push({x: lastCoordinate.x, y: lastCoordinate.y - 1});
      break;
    case '^':
      coordinates.push({x: lastCoordinate.x, y: lastCoordinate.y + 1});
      break;
  }
  return coordinates;
}

const coordinateToPresentMapReducer = (presentMap: PresentMap, coordinate: Coordinate) => {
  presentMap.visit(coordinate);
  return presentMap;
}

interface MovementAggregator {
  presentMap: PresentMap,
  lastCoordinate: Coordinate
}

interface MovementAggregatorWithRobo {
  presentMap: PresentMap,
  lastCoordinate: Coordinate
  lastRoboCoordinate: Coordinate,
  lastWasRobo: boolean
}

const movementToPresentMapReducer =
  ({
     presentMap,
     lastCoordinate
   }: MovementAggregator, movement: string): MovementAggregator => {

    const nextCoordinate = moveFromCoordinate(lastCoordinate, movement);
    presentMap.visit(nextCoordinate);
    return {lastCoordinate: nextCoordinate, presentMap};
  }

const movementToRoboPresentMapReducer =
  ({
     presentMap,
     lastCoordinate,
     lastRoboCoordinate,
     lastWasRobo
   }: MovementAggregatorWithRobo, movement: string): MovementAggregatorWithRobo => {

    const nextCoordinate = lastWasRobo ? moveFromCoordinate(lastCoordinate, movement) : lastCoordinate;
    const nextRoboCoordinate = lastWasRobo ? lastRoboCoordinate : moveFromCoordinate(lastRoboCoordinate, movement);
    lastWasRobo ? presentMap.visit(nextCoordinate) : presentMap.visit(nextRoboCoordinate);
    return {
      lastCoordinate: nextCoordinate,
      lastRoboCoordinate: nextRoboCoordinate,
      lastWasRobo: !lastWasRobo,
      presentMap
    };
  }

const moveFromCoordinate = (coordinate: Coordinate, movement: string): Coordinate => {
  switch (movement) {
    case '<':
      return {x: coordinate.x - 1, y: coordinate.y};
    case '>':
      return {x: coordinate.x + 1, y: coordinate.y};
    case 'v':
      return {x: coordinate.x, y: coordinate.y - 1};
    case '^':
      return {x: coordinate.x, y: coordinate.y + 1};
    default:
      throw `UNEXPECTED INPUT VALUE: ${movement}`
  }
}
const part1 = () => {
  return dataInput.split('')
    .reduce(movementToCoordinatesReducer, [{x: 0, y: 0}])
    .reduce(coordinateToPresentMapReducer, new PresentMap())
    .getAll()
    .length
}

const part1_1 = () => {
  return dataInput.split('')
    .reduce(movementToPresentMapReducer, {presentMap: new PresentMap(), lastCoordinate: {x: 0, y: 0}})
    .presentMap
    .getAll()
    .length
}

const part2 = () => {
  return dataInput.split('')
    .reduce(movementToRoboPresentMapReducer, {
      presentMap: new PresentMap(),
      lastCoordinate: {x: 0, y: 0},
      lastRoboCoordinate: {x: 0, y: 0},
      lastWasRobo: true
    })
    .presentMap
    .getAll()
    .length
}

await runMetricsTest(part1_1, 'Part 1');
await runMetricsTest(part2, 'Part 2');
