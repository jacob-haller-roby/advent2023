import readFile from "../utils/readFile";
import runTest from "../utils/runTest";
import runMetricsTest from "../utils/runMetricsTest";

const dataInput = await readFile('day8.txt');

class Node {
  left: Node;
  right: Node;
  value: string;
}

interface VisitedRecord {
  steps: number[],
  value: string;
}

interface Loop {
  length: number;
  offset: number;
}

const part1 = () => {
  const [instructions, nodes] = dataInput.split('\n\n');
  let currentNode = parseNodes(nodes).AAA;
  for (let i = 0; ; i++) {
    if (currentNode.value === 'ZZZ') return i;
    const instruction = instructions[i % instructions.length];
    currentNode = instruction === 'L' ? currentNode.left : currentNode.right;
  }
}

const part2 = () => {
  const [instructions, nodes] = dataInput.split('\n\n');
  const nodeMap = parseNodes(nodes);
  let currentNodes = Object.keys(nodeMap)
    .filter(key => key[2] === 'A')
    .map(key => nodeMap[key]);

  const visitedDestinations: Record<string, VisitedRecord>[] = currentNodes.map(() => ({}));
  for (let i = 0; ; i++) {
    // Update loop definitions
    currentNodes.forEach((node, nodeIndex) => {
      if (node.value[2] === 'Z') {
        visitedDestinations[nodeIndex][node.value] ??= {value: node.value, steps: []}
        visitedDestinations[nodeIndex][node.value].steps.push(i)
      }
    });
    // If all nodes are looped, break
    if (visitedDestinations.every(destinationMap =>
      Object.values(destinationMap).some(record => record.steps.length > 1)
    )) {
      break;
    }
    // else execute next instruction
    const instruction = instructions[i % instructions.length];
    currentNodes = currentNodes
      .map(currentNode => instruction === 'L' ? currentNode.left : currentNode.right);
  }

  // Collect visits into loop definitions of length/offset
  const loops = visitedDestinations
    .map(destinationMap => Object.values(destinationMap)[0]) // only 1 destination per starting location, thankfully
    .map(recordToLoop);

  // iterate based on longest loop to maximize intervals
  const maxLengthLoop = loops.reduce(reduceToMaxLoopLength, {length: -Infinity, offset: 0});

  for (let i = maxLengthLoop.offset + maxLengthLoop.length; ; i += maxLengthLoop.length) {
    // if every loop is at its start, return
    if (loops.every(loop =>
      (i - loop.offset) % loop.length === 0
    )) return i;
  }
}

const reduceToMaxLoopLength = (maxLoop: Loop, loop: Loop): Loop => maxLoop.length > loop.length ? maxLoop : loop;
const recordToLoop = (record: VisitedRecord): Loop => ({
  length: record.steps[1] - record.steps[0],
  offset: record.steps[0]
})

const parseNodes = (nodesString: string): Record<string, Node> => {
  return nodesString.split('\n')
    .map(row => {
      const [value, left, right] =
        [...row.matchAll(/\w{3}/g)]
          .map(match => match[0])
      return {value, left, right}
    })
    .reduce((map: Record<string, Node>, row) => {
      if (map[row.value] === undefined) {
        map[row.value] = new Node();
        map[row.value].value = row.value;
      }
      if (map[row.left] === undefined) {
        map[row.left] = new Node();
        map[row.left].value = row.left;
      }
      if (map[row.right] === undefined) {
        map[row.right] = new Node();
        map[row.right].value = row.right;
      }
      map[row.value].left = map[row.left];
      map[row.value].right = map[row.right];
      return map;
    }, {})
}

await runTest(part1, 'Part 1');
await runTest(part2, 'Part 2');