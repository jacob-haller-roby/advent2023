import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day7.txt');
const part1 = () => {
  return dataInput.split('\n')
    .map(parseRow)
    .map(handToHandScore)
    .sort(handScoreComparator)
    .map(handScoreToScore)
    .reduce((acc, cur) => acc + cur, 0);
}

interface Hand {
  cards: string,
  bid: number
}

interface HandScore {
  score: number,
  bid: number
}

const parseRow = (row: string): Hand => {
  const [cards, bid] = row.split(' ');
  return {cards, bid: Number(bid)};
}

const handToHandScore = (hand: Hand): HandScore => {
  return {
    bid: hand.bid,
    score: getCardOrderScore(hand) + getHandTypeScore(hand)
  }
}

const handToWildHandScore = (hand: Hand): HandScore => {
  return {
    bid: hand.bid,
    score: getWildCardOrderScore(hand) + getWildHandTypeScore(hand)
  }
}

const getCardOrderScore = (hand: Hand): number => {
  return Number(
    hand.cards.split('')
      .map(card => {
        return {
          '2': 12,
          '3': 13,
          '4': 14,
          '5': 15,
          '6': 16,
          '7': 17,
          '8': 18,
          '9': 19,
          'T': 20,
          'J': 21,
          'Q': 22,
          'K': 23,
          'A': 24
        }[card];
      }).join('')
  );
}


const getWildCardOrderScore = (hand: Hand): number => {
  return Number(
    hand.cards.split('')
      .map(card => {
        return {
          '2': 12,
          '3': 13,
          '4': 14,
          '5': 15,
          '6': 16,
          '7': 17,
          '8': 18,
          '9': 19,
          'T': 20,
          'J': 11,
          'Q': 22,
          'K': 23,
          'A': 24
        }[card];
      }).join('')
  );
}

const getHandTypeScore = (hand: Hand): number => {
  const handObject: Record<string, number> = hand.cards.split('').reduce((obj, card) => {
    obj[card] = (obj[card] || 0) + 1;
    return obj;
  }, {});
  const cardCount = Object.values(handObject).sort().join('');
  switch (cardCount) {
    // Five of a kind
    case '5':
      return 60000000000;
    // Four of a kind
    case '14':
      return 50000000000;
    // Full House
    case '23':
      return 40000000000;
    // Three of a kind
    case '113':
      return 30000000000;
    // Two pair
    case '122':
      return 20000000000;
    // One pair
    case '1112':
      return 10000000000;
    // High Card
    case '11111':
      return 0;
    default:
      throw `Unrecognized hand: ${hand.cards}`;
  }
}


const getWildHandTypeScore = (hand: Hand): number => {
  const handObject: Record<string, number> = hand.cards.split('').reduce((obj, card) => {
    obj[card] = (obj[card] || 0) + 1;
    return obj;
  }, {});
  const jokerCount = handObject.J || 0;
  delete handObject.J;
  const cardCountArray = Object.values(handObject).sort();
  if (cardCountArray.length === 0) cardCountArray.push(0);
  cardCountArray[cardCountArray.length - 1] += jokerCount;
  const cardCount = cardCountArray.join('');

  switch (cardCount) {
    // Five of a kind
    case '5':
      return 60000000000;
    // Four of a kind
    case '14':
      return 50000000000;
    // Full House
    case '23':
      return 40000000000;
    // Three of a kind
    case '113':
      return 30000000000;
    // Two pair
    case '122':
      return 20000000000;
    // One pair
    case '1112':
      return 10000000000;
    // High Card
    case '11111':
      return 0;
    default:
      throw `Unrecognized hand: ${hand.cards}`;
  }
}

const part2 = () => {
  return dataInput.split('\n')
    .map(parseRow)
    .map(handToWildHandScore)
    .sort(handScoreComparator)
    .map(handScoreToScore)
    .reduce((acc, cur) => acc + cur, 0);
}

const handScoreComparator = (a: HandScore, b: HandScore): number => a.score - b.score;

const handScoreToScore = (handScore: HandScore, rank: number): number => handScore.bid * (rank + 1);


await runMetricsTest(part1, 'Part 1');
await runMetricsTest(part2, 'Part 2');
