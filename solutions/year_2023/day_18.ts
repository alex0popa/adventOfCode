import { directionsVectorMap } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Direction = 'U' | 'R' | 'D' | 'L';

type Instruction = {
  direction: Direction;
  value: number;
  color: string;
};

const testInput = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    // const input = testInput
    .trim()
    .split('\n')
    .map<Instruction>((line) => {
      const [direction, value, color] = line.split(' ');

      return { direction: direction as Direction, value: +value, color };
    });

  let [row, col] = [0, 0];

  const rowsMap = new Map<number, { direction: Direction; col: number }[]>();

  for (const { direction, value } of input) {
    let [x, y] = directionsVectorMap.N.map(Number);

    if (direction === 'R') [x, y] = directionsVectorMap.E;

    if (direction === 'D') [x, y] = directionsVectorMap.S;

    if (direction === 'L') [x, y] = directionsVectorMap.W;

    for (let i = 0; i < value; ++i) {
      row += x;
      col += y;

      rowsMap.set(row, [...(rowsMap.get(row) ?? []), { direction, col }]);
    }
  }

  const rows = Array.from(rowsMap.values()).map((elements) =>
    elements.sort((a, b) => a.col - b.col),
  );

  let star1 = 0;

  for (let j = 0; j < rows.length; ++j) {
    const row = rows[j];
    const upDown = [...row].filter(({ direction }) =>
      ['U', 'D'].includes(direction),
    );
    let cubicMeters = 0;

    if (upDown.length % 2) console.log('% upDown -> ', j);

    if (upDown.length > 1) {
      let startCol: number | undefined;
      for (let i = 0; i < row.length; ++i) {
        const { col, direction } = row[i];

        if (['L', 'R'].includes(direction) && typeof startCol === 'undefined') {
          ++cubicMeters;
        } else if (
          !['L', 'R'].includes(direction) &&
          typeof startCol === 'undefined'
        ) {
          startCol = col;
          ++cubicMeters;
        } else if (
          !['L', 'R'].includes(direction) &&
          typeof startCol === 'number'
        ) {
          const val = col - startCol;

          cubicMeters += val;

          startCol = undefined;
        }
      }
    } else {
      cubicMeters += row.length;
    }

    star1 += cubicMeters;

    // console.log(j, ' -> ', cubicMeters, ' -> ', row.map(({ direction, col }) => direction + ' ' + col).join(' | '))
  }

  // 34540 low
  // 34582 low
  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();
//   0123456
// 0 #######  7
// 1 #.....#  7
// 2 ###...#  7
// 3 ..#...#  5
// 4 ..#...#  5
// 5 ###.###  7
// 6 #...#..  5
// 7 ##..###  7
// 8 .#....#  6
// 9 .######  6

//   0123456
// 0 ##########  7
// 1 #........#  7
// 2 ###......#  7
// 3 ..#......#  5
// 4 ..#####...#  5
// 5 ####..#.###  7
// 6 #...#..#.#..  5
// 7 ##..#..#.###  7
// 8 .#..#..#...#  6
// 9 .####..#####  6

// let [R ,L ,D , U] = [0, 0, 0, 0];

//   input.forEach(({ direction, value }) => {
//     if(direction === 'U') ++U;
//     if(direction === 'R') ++R;
//     if(direction === 'D') ++D;
//     ++L;

//   });

//   const rows = 4 * (U + D + 1);
//   const cols = 4 * (L + R + 1);

//   const matrix: string[][] = [];

//   for (let x = 0; x < rows; ++x) {
//     const line: string[] = [];

//     for (let y = 0; y < cols; ++y) {
//       line.push('.');
//     }

//     // console.log(line.join(''));

//     matrix.push([...line]);
//   }

//   let [row, col] = [Math.floor(rows / 2), Math.floor(cols / 2)];
//   matrix[row][col] = '#';

// console.log({rows, cols, row, col});
//   // matrix.forEach(line => console.log(line.join('')));
//   input.forEach(({ direction, value }) => {
//     let [x, y] = mapVectors.N.map(Number);

//     if(direction === 'R') {
//       [x, y] = mapVectors.E
//     }

//     if(direction === 'D') {
//       [x, y] = mapVectors.S
//     }

//     if(direction === 'L') {
//       [x, y] = mapVectors.W
//     }

//     for(let i = 0; i < value; ++i) {
//       row += x;
//       col += y;
//       matrix[row][col] = '#';
//       // console.log({ direction, value, row, col, t: matrix[row][col] });
//     }

//   });
//   matrix.forEach(line => console.log(line.join('')));
