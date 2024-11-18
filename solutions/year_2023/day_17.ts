import { directionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import Heap from 'heap-js';

type Position = {
  row: number,
  col: number,
  vector: { x: number, y: number },
  heat: number,
  sameDirection: number
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number));

  const star1 = getStar(input);

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();

function getStar(input: number[][]) {
  const visited = new Map<number, boolean>();
  const minHeap = new Heap<Position>((a, b) => a.heat - b.heat);

  minHeap.init([{
    row: 0,
    col: 0,
    sameDirection: 0,
    vector: { x: 0, y: 0 },
    heat: 0
  }]);


  const endPoint = { row: input.length - 1, col: input[0].length - 1 };

  let pos: Position | undefined;

  while (pos = minHeap.pop()) {
    if (pos.row === endPoint.row && pos.col === endPoint.col) return pos.heat;

    let dir = 2;
    if (pos.vector.x === 1) {
      dir = 3
    } else if (pos.vector.y === -1) {
      dir = 4
    } else if (pos.vector.y === 1) {
      dir = 5
    }

    const key = pos.row * 1000000 + pos.col * 1000 + dir * 10 + pos.sameDirection;

    if (visited.get(key)) continue;

    visited.set(key, true);

    for (const [x, y] of directionsVector) {
      const [row, col] = [pos.row + x, pos.col + y];

      if (!input[row]?.[col]) continue;

      if (x === -pos.vector.x && y === -pos.vector.y) continue;

      const sameDirection = x === pos.vector.x && y === pos.vector.y;

      if (sameDirection && pos.sameDirection === 3) continue;

      minHeap.push({
        row,
        col,
        heat: pos.heat + input[row][col],
        sameDirection: sameDirection ? pos.sameDirection + 1 : 1,
        vector: { x, y }
      })

    }
  }

  throw ('Not ok =D')
}
