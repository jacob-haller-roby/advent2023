import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day1.txt', 2016);

const part1 = () => {
  const finalPosition = dataInput.split(', ')
    .map(parseRow)
    .reduce(reduceActions, {direction: Direction.UP, x: 0, y: 0});
  return finalPosition.x + finalPosition.y;
}

enum Turn {
  LEFT = 'L',
  RIGHT = 'R'
}

const TurnMap: Record<Turn, Turn> = {
  [Turn.LEFT]: Turn.LEFT,
  [Turn.RIGHT]: Turn.RIGHT
}
const convertStringToTurn = (str: string): Turn => TurnMap[str];

interface Action {
  turn: Turn,
  distance: number
}

const parseRow = (row: string): Action => {
  const turn = convertStringToTurn(row[0]);
  const distance = Number(row.substring(1));
  return {
    turn, distance
  }
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

interface Position {
  x: number,
  y: number,
  direction: Direction
}

const RightTurnMap: Record<Direction, Direction> = {
  [Direction.UP]: Direction.RIGHT,
  [Direction.DOWN]: Direction.LEFT,
  [Direction.LEFT]: Direction.UP,
  [Direction.RIGHT]: Direction.DOWN
}
const LeftTurnMap: Record<Direction, Direction> = {
  [Direction.UP]: Direction.LEFT,
  [Direction.DOWN]: Direction.RIGHT,
  [Direction.LEFT]: Direction.DOWN,
  [Direction.RIGHT]: Direction.UP
}
const reduceActions = (position: Position, action: Action): Position => {
  const newDirection = action.turn === Turn.RIGHT ?
    RightTurnMap[position.direction] :
    LeftTurnMap[position.direction];
  switch (newDirection) {
    case Direction.UP:
      return {
        direction: Direction.UP,
        x: position.x,
        y: position.y + action.distance
      }
    case Direction.RIGHT:
      return {
        direction: Direction.RIGHT,
        x: position.x + action.distance,
        y: position.y
      }
    case Direction.LEFT:
      return {
        direction: Direction.LEFT,
        x: position.x - action.distance,
        y: position.y
      }
    case Direction.DOWN:
      return {
        direction: Direction.DOWN,
        x: position.x,
        y: position.y - action.distance
      }
    default:
      throw 'INVALID NEW DIRECTION'
  }
}

await runMetricsTest(part1, 'Part 1')
