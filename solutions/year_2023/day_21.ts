import { directionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { Point } from '../../helpers/typescript';

const testInput = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n').map(line => line.split(''));
  const STEPS = 64;
  // const input = testInput.trim().split('\n').map(line => line.split(''));
  const start: Point = { row: -1, col: -1 };

  for (let row = 0; start.row < 0; ++row) {
    if (input[row].includes('S')) {
      start.row = row;
      start.col = input[row].indexOf('S');
    }
  }

  input[start.row][start.col] = '.';

  let tail = [`${start.row}-${start.col}`];

  for (let step = 1; step <= STEPS; ++step) {
    const partialTail = new Set<string>();

    while (tail.length) {
      const [pointRow, pointCol] = tail.pop()!.split('-');

      directionsVector.forEach(([x, y]) => {
        const [row, col] = [+pointRow + x, +pointCol + y];
        const el = input[row][col];

        if (el === '.') partialTail.add(`${row}-${col}`);
      });
    }

    tail = Array.from(partialTail)
  }

  showTheResult({ star1: tail.length, star2: 'WIP...', path: __filename });
})();

type GardenPoint = Point & { X: number, Y: number };

// (async () =>  {
//   console.time('time');
//   // const input = (await getInputForDay(__filename)).trim().split('\n').map(line => line.split(''));
//   // const STEPS = 10;
//   const STEPS = 100;
//   const input = testInput.trim().split('\n').map(line => line.split(''));
//   const start: GardenPoint = { row: -1, col: -1, X: 0, Y: 0 };

//   for(let row = 0; start.row < 0; ++row) {
//     if(input[row].includes('S')) {
//       start.row = row;
//       start.col = input[row].indexOf('S');
//     }
//   }

//   input[start.row][start.col] = '.';

//   let tail = [start];
//   const visited = new Set<string>();

//   for(let step = 1; step <= STEPS; ++step) {
//     const partialTail: GardenPoint[] = [];

//     while(checkPoint(tail.pop(), input, visited, partialTail));

//     tail = [...partialTail];

//     console.log(step, ' -> ', tail.length)
//     visited.clear();
//   }

//   showTheResult({ star1: tail.length, star2: 'WIP...', path: __filename });
// })();

function checkPoint(point: GardenPoint | undefined, input: string[][], visited: Set<string>, partialTail: GardenPoint[]) {
  if (!point) return false;

  const northEdge = 0;
  const estEdge = input[0].length - 1;
  const southEdge = input.length - 1;
  const westEdge = 0;

  directionsVector.forEach((vector) => {
    let [row, col] = [point.row + vector[0], point.col + vector[1]];
    let { X, Y } = { ...point };

    // NORTH
    if (row === northEdge - 1) {
      row = southEdge;
      Y += 1;
      // SOUTH
    } else if (row === southEdge + 1) {
      row = northEdge;
      Y -= 1;
      // WEST
    } else if (col === westEdge - 1) {
      col = estEdge;
      X -= 1;
      // EAST
    } else if (col === estEdge + 1) {
      col = westEdge;
      X += 1;
    }

    const el = input[row][col];
    const key = `${X}-${Y}-${row}-${col}`;


    if (el === '.' && !visited.has(key)) {
      partialTail.push({ X, Y, row, col });
      visited.add(key);
    }
  });

  return true;
}
