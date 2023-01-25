import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const [POURING_ROW, POURING_COL, GRID_WIDTH] = [0, 500, 1000] as const;

/**
 * Solution with grid, more visible but uses too much space
 */
// (async () => {
//   const [EMPTY, ROCK, REST, POURING_POINT] = ['.', '#', 'o', '+'] as const;
//   const fillRow = <T>(param: T) => Array<T>(GRID_WIDTH).fill(param);

//   const input = (await getInputForDay(__filename))
//     .trim()
//     .split('\n')
//     .map((l) => l.split(' -> ').map((str) => str.split(',').map(Number)));

//   let rowMax = -Infinity;

//   const coordinates = input.map((line) =>
//     line.map(([col, row]) => {
//       rowMax = Math.max(rowMax, row);

//       return [row, col];
//     })
//   );

//   const grid = Array<string>(rowMax + 1)
//     .fill(EMPTY)
//     .map(fillRow);

//   // pouring point
//   grid[POURING_ROW][POURING_COL] = POURING_POINT;

//   // part two, empty line and floor
//   grid.push(fillRow(EMPTY));
//   grid.push(fillRow(ROCK));

//   // add rocks
//   coordinates.forEach(([[startRow, starCol], ...line]) => {
//     line.forEach(([endRow, endCol]) => {
//       let [x1, x2] =
//         startRow < endRow ? [startRow, endRow] : [endRow, startRow];
//       let [y1, y2] = starCol < endCol ? [starCol, endCol] : [endCol, starCol];

//       while (x1 < x2 || y1 < y2) {
//         x1 < x2 && (grid[x1++][y1] = ROCK);
//         y1 < y2 && (grid[x1][y1++] = ROCK);
//       }

//       grid[x1][y1] = ROCK;

//       [startRow, starCol] = [endRow, endCol];
//     });
//   });

//   grid.forEach((line) => console.log(line.slice(450, 550).join('')));

//   let star1 = 0;
//   let star2 = 0;

//   let row = POURING_ROW;
//   let col = POURING_COL;

//   while (grid[POURING_ROW][POURING_COL] === POURING_POINT) {
//     // part one, sand starts flowing into the abyss
//     star1 === POURING_ROW && row === grid.length - 2 && (star1 = star2);

//     // down
//     if (grid[row + 1][col] === EMPTY) {
//       ++row;

//       // dows - left
//     } else if (grid[row + 1][col - 1] === EMPTY) {
//       ++row;
//       --col;

//       // down - right
//     } else if (grid[row + 1][col + 1] === EMPTY) {
//       ++row;
//       ++col;

//       // sand rest and reset
//     } else {
//       grid[row][col] = REST;
//       row = POURING_ROW;
//       col = POURING_COL;
//       ++star2;
//     }
//   }

//   // print the result, better for the small input
//   // grid.forEach((line) => console.log(line.slice(450, 550).join('')));

//   showTheResult({ star1, star2, path: __filename });
// })();

/**
 * SOLUTION USING SET,
 *
 * Need to keep track of rocks and sand, all rocks and sand go to Set
 */
(async () => {
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((l) => l.split(' -> '));

  const markers = new Set<string>();
  const start = `${POURING_COL},${POURING_ROW}` as const;
  let maxRow = -Infinity;

  // add the rocks
  input.forEach(([str, ...rest]) => {
    let [startCol, startRow] = str.split(',').map(Number);

    // find the highest row
    maxRow = Math.max(maxRow, startRow);

    rest.forEach((pair) => {
      const [endCol, endRow] = pair.split(',').map(Number);

      let [y1, y2] =
        startRow < endRow ? [startRow, endRow] : [endRow, startRow];

      let [x1, x2] =
        startCol < endCol ? [startCol, endCol] : [endCol, startCol];

      while (x1 < x2 || y1 < y2) {
        x1 < x2 && markers.add(`${x1++},${y1}`);
        y1 < y2 && markers.add(`${x1},${y1++}`);
      }

      markers.add(`${x1},${y1}`);

      [startRow, startCol] = [endRow, endCol];
    });
  });

  let col = POURING_COL;
  let row = POURING_ROW;

  const markAndReset = () => {
    markers.add(`${col},${row}`);

    col = POURING_COL;
    row = POURING_ROW;
  };

  let star1 = 0;
  let star2 = 0;

  while (!markers.has(start)) {
    // floor limit
    row === maxRow + 2 && markAndReset();

    // part one, sand starts flowing into the abyss
    star1 === 0 && row === maxRow && (star1 = star2);

    // down
    if (!markers.has(`${col},${row + 1}`)) {
      ++row;

      // dows - left
    } else if (!markers.has(`${col - 1},${row + 1}`)) {
      ++row;
      --col;

      // down - right
    } else if (!markers.has(`${col + 1},${row + 1}`)) {
      ++row;
      ++col;

      // sand rest and reset
    } else {
      markAndReset();

      ++star2;
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();
