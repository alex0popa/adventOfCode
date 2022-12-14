import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const [EMPTY, ROCK, REST, POURING_POINT] = ['.', '#', 'o', '+'] as const;
const [POURING_ROW, POURING_COL, GRID_WIDTH] = [0, 500, 1000] as const;

const fillRow = <T>(param: T) => Array<T>(GRID_WIDTH).fill(param);

(async () => {
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((l) => l.split(' -> ').map((str) => str.split(',').map(Number)));

  let rowMax = -Infinity;

  const coordinates = input.map((line) =>
    line.map(([col, row]) => {
      rowMax = Math.max(rowMax, row);

      return [row, col];
    })
  );

  const grid = Array<string>(rowMax + 1)
    .fill(EMPTY)
    .map(fillRow);

  // pouring point
  grid[POURING_ROW][POURING_COL] = POURING_POINT;

  // part two, empty line and floor
  grid.push(fillRow(EMPTY));
  grid.push(fillRow(ROCK));

  // add rocks
  coordinates.forEach(([[startRow, starCol], ...line]) => {
    line.forEach(([endRow, endCol]) => {
      let [x1, x2] =
        startRow < endRow ? [startRow, endRow] : [endRow, startRow];
      let [y1, y2] = starCol < endCol ? [starCol, endCol] : [endCol, starCol];

      while (x1 < x2 || y1 < y2) {
        x1 < x2 && (grid[x1++][y1] = ROCK);
        y1 < y2 && (grid[x1][y1++] = ROCK);
      }

      grid[x1][y1] = ROCK;

      [startRow, starCol] = [endRow, endCol];
    });
  });

  let star1 = 0;
  let star2 = 0;

  let row = POURING_ROW;
  let col = POURING_COL;

  while (grid[POURING_ROW][POURING_COL] === POURING_POINT) {
    // part one, sand starts flowing into the abyss
    star1 === POURING_ROW && row === grid.length - 2 && (star1 = star2);

    // down
    if (grid[row + 1][col] === EMPTY) {
      ++row;

      // dows - left
    } else if (grid[row + 1][col - 1] === EMPTY) {
      ++row;
      --col;

      // down - right
    } else if (grid[row + 1][col + 1] === EMPTY) {
      ++row;
      ++col;

      // sand rest and reset
    } else {
      grid[row][col] = REST;
      row = POURING_ROW;
      col = POURING_COL;
      ++star2;
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();
