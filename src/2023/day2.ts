import readFile from "../utils/readFile";
import runTest from "../utils/runTest";

void runTest(async () => {

  const inputData = await readFile('day2.txt');
  interface Game {
    id: number,
    pulls: Pull[]
  }

  interface Pull {
    red: number,
    green: number,
    blue: number
  }

  const ZeroPullIdentity: Pull = {
    red: 0,
    green: 0,
    blue: 0
  } as const;

  const parseRow = (row: string): Game => {
    const [idString, pullsString] = row.split(':');

    const id = Number(idString.split(' ')[1]);

    const pulls = pullsString
      .split(';')
      .map(parsePull);

    return {
      id,
      pulls
    }
  }

  const parsePull = (pullString: string): Pull => {
    return pullString
      .split(',')
      .reduce((pull, colorPull) => {
        const [count, color] = colorPull.trim().split(' ');
        return {
          ...pull,
          [color]: Number(count)
        };
      }, ZeroPullIdentity);
  }

  const isValidGame = (game: Game): boolean => {
    const maxPulls = game.pulls.reduce(maxPullReducer, ZeroPullIdentity);
    return maxPulls.red <= 12 &&
      maxPulls.green <= 13 &&
      maxPulls.blue <= 14;
  }


  const makePullReducer = (colorCombiner: (a: number, b: number) => number) =>
    (acc: Pull, cur: Pull): Pull => ({
      red: colorCombiner(acc.red, cur.red),
      green: colorCombiner(acc.green, cur.green),
      blue: colorCombiner(acc.blue, cur.blue),
    });

  const maxPullReducer = makePullReducer(Math.max);

  const getPullPower = (pull: Pull): number =>
    pull.red * pull.green * pull.blue;

  // Part 1
  // const result = inputData.split('\n')
  //   .map(parseRow)
  //   .filter(isValidGame)
  //   .map(game => game.id)
  //   .reduce((acc, cur) => acc + cur);

  // Part 2
  const result = inputData.split('\n')
    .map(parseRow)
    .map(game => game.pulls)
    .map(pulls => pulls.reduce(maxPullReducer, ZeroPullIdentity))
    .map(getPullPower)
    .reduce((acc, cur) => acc + cur, 0);

  return result;
});