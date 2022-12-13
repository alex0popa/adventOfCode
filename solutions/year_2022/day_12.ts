import { directionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getDistance = (
  grid: string[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  steps = Infinity
) => {
  let que: number[][] = [[startRow, startCol, 0]];
  const visited = new Set<string>();
  visited.add(`${startRow} ${startCol}`);

  while (que.length) {
    const [row, col, dist] = que.shift()!;
    const actual = grid[row][col];

    directionsVector
      .map(([i, j]) => [row + i, col + j])
      .forEach(([newRow, newCol]) => {
        const target: string | undefined = grid[newRow]?.[newCol];
        const visitedEl = `${newRow} ${newCol}`;
        const inTheGrid = typeof target === 'string';
        const notVisited = !visited.has(visitedEl);
        const isValidChar =
          inTheGrid && target.charCodeAt(0) - actual.charCodeAt(0) < 2;
        const endReached = newRow == endRow && newCol === endCol;

        if (inTheGrid && notVisited && isValidChar) {
          /**
           * This condition must stai here to be sure that the end is reached
           * in a right way
           */
          if (endReached) {
            steps = dist + 1;

            // stop loops
            que = [];

            return;
          }

          visited.add(visitedEl);
          que.push([newRow, newCol, dist + 1]);
        }
      });
  }

  return steps;
};

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  let [startRow, startCol, endRow, endCol] = [0, 0, 0, 0];

  const grid = input.map((line, i) =>
    line.split('').map((char, j) => {
      if (char === 'S') {
        startRow = i;
        startCol = j;
        char = 'a';
      }

      if (char === 'E') {
        endRow = i;
        endCol = j;
        char = 'z';
      }

      return char;
    })
  );

  const star1 = getDistance(grid, startRow, startCol, endRow, endCol);

  const starts = grid.reduce<number[][]>((arr, line, row) => {
    line.forEach((char, col) => char === 'a' && arr.push([row, col]));

    return arr;
  }, []);

  const star2 = starts.reduce((minimumSteps, [row, col]) => {
    const steps = getDistance(grid, row, col, endRow, endCol);

    return Math.min(steps, minimumSteps);
  }, Infinity);

  showTheResult({ star1, star2, path: __filename });
})();
