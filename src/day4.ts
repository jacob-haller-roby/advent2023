import runTest from "./utils/runTest";
import readFile from "./utils/readFile";

interface Card {
  id: number
  winningNumbers: number[],
  myNumbers: number[]
}

const parseRow = (row: string): Card => {
  const [cardNameString, numbersString] = row.split(':');
  const id = Number(cardNameString.match(/\d+/g)[0]);
  const [winningNumbersString, myNumbersString] = numbersString.split('|');
  const winningNumbers = parseNumbers(winningNumbersString);
  const myNumbers = parseNumbers(myNumbersString);
  return {
    id, myNumbers, winningNumbers
  };
}

const parseNumbers = (numberString: string): number[] =>
  [
    ...numberString.matchAll(/\d+/g)
  ]
  .map(match => match[0])
  .map(number => Number(number));

const findMatchedNumbers = (card: Card): number[] => {
  const winningNumberMap = card.winningNumbers.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {});

  return card.myNumbers.filter(myNumber => winningNumberMap[myNumber]) || [];
}

const countToScore = (count: number): number => count === 0 ? 0 : Math.pow(2, count - 1);

const calculateScratchCardScore = async () => {
  const dataInput = await readFile('day4.txt');
  return dataInput.split('\n')
    .map(parseRow)
    .map(findMatchedNumbers)
    .map(matchedNumbers => matchedNumbers.length)
    .map(countToScore)
    .reduce((acc, cur) => acc + cur, 0);
}

const makeRecursiveScoreSearch = (winners: number[][]) => {
  const scores = Array(winners.length).fill(undefined);
  const recursiveScoreSearch = (id: number) => {
    if (scores[id] != undefined) {
      return scores[id];
    }
    if (winners[id].length === 0) {
      scores[id] = 1;
      return 1;
    }
    const score = winners[id]
        .map((_, i) => recursiveScoreSearch(id + 1 + i))
        .reduce((acc, cur) => acc + cur, 0)
      + 1;
    scores[id] = score;
    return score;
  }
  return recursiveScoreSearch;
}


const calculateScratchCardCollection = async () => {
  const dataInput = await readFile('day4.txt');
  const cards = dataInput.split('\n')
    .map(parseRow);
  const winners: number[][] = cards.map(findMatchedNumbers);
  winners.unshift([]);

  const recursiveScoreSearch = makeRecursiveScoreSearch(winners);
  return cards
    .map(card => card.id)
    .map(recursiveScoreSearch)
    .reduce((acc, cur) => acc + cur, 0);
}


void runTest(calculateScratchCardScore, 'Part 1');
void runTest(calculateScratchCardCollection, 'Part 2');
