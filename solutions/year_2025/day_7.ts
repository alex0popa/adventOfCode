import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { countPathsToLeaves } from '../../helpers/graph';

const SPLITER = '^';

const inputX = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`.split('\n');

type NodeId = `${number}-${number}`;
type TreeMap = Map<NodeId, NodeId[]>;
type FindChildParams = {
  filteredInput: string[];
  row: number;
  col: number;
};

const findChild = ({ filteredInput, row, col }: FindChildParams): NodeId => {
  for (
    let currentRow = row + 1;
    currentRow < filteredInput.length;
    currentRow++
  ) {
    if (filteredInput[currentRow][col] === SPLITER) {
      return `${currentRow}-${col}`;
    }
  }

  return `${filteredInput.length}-${col}`;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const startIdx = input[0].indexOf('S');

  const beamPositions = new Set<number>([startIdx]);
  const beamMap: TreeMap = new Map<NodeId, NodeId[]>();

  let star1 = 0;

  input
    .filter((line) => line.includes('^'))
    .forEach((line, row, filteredInput) => {
      for (let col = 0; col < line.length; col++) {
        if (line[col] === SPLITER && beamPositions.has(col)) {
          star1++;
          const left = col - 1;
          const right = col + 1;

          beamPositions.add(right).add(left).delete(col);

          const leftChild = findChild({ filteredInput, row, col: left });
          const rightChild = findChild({ filteredInput, row, col: right });

          beamMap.set(`${row}-${col}`, [leftChild, rightChild]);
        }
      }
    });

  const star2 = countPathsToLeaves(`0-${startIdx}`, beamMap);

  showTheResult({
    star1,
    star2,
    path: __filename,
  });

  console.timeEnd('time');
})();
