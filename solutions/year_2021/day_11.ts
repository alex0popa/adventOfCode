import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const FIRST100STEPS = 100,
  ALL_OCTOPUSES = 100;
const coords: number[][] = [];
const vector = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const day11 = async () => {
  const input = (await getInputForDay(__filename))
    .split('\n')
    .map((line) => line.split('').map((c) => (isNaN(+c) ? c : +c)));

  let [star1, star2, notAllFlash] = [0, 0, true];

  const computeFlash = (row: number, col: number, flashed = 0) => {
    input[row][col] = +input[row][col] + 1;

    if (input[row][col] === 10) {
      star2 <= FIRST100STEPS && ++star1;
      ++flashed;
      coords.push([row, col]);
      input[row][col] = 0;
    }

    return flashed;
  };

  while (notAllFlash) {
    ++star2;
    let flashed = 0;

    for (let i = 1; i <= 10; ++i) {
      for (let j = 1; j <= 10; ++j) {
        flashed += computeFlash(i, j);
      }
    }

    while (coords.length) {
      const [i, j] = coords.shift()!;

      vector.forEach(
        ([a, b]) =>
          input[i + a][j + b] > 0 && (flashed += computeFlash(i + a, j + b))
      );
    }

    flashed === ALL_OCTOPUSES && (notAllFlash = false);
  }

  showTheResult({ star1, star2, path: __filename });
};

day11();
