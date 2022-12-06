import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const day9 = async () => {
  const input = (await getInputForDay(__filename))
    .split('\n')
    .map((line) => line.split('').map(Number));

  const isSmallest = (i: number, j: number) => {
    const [u, r, d, l, x] = [
      input[i - 1][j],
      input[i][j + 1],
      input[i + 1][j],
      input[i][j - 1],
      input[i][j],
    ];

    return (
      (isNaN(u) || x < u) &&
      (isNaN(r) || x < r) &&
      (isNaN(d) || x < d) &&
      (isNaN(l) || x < l)
    );
  };

  const basins: number[][] = [];

  let star1 = 0;

  for (let i = 1; i < input.length - 1; ++i) {
    for (let j = 1; j < input[0].length - 1; ++j) {
      if (isSmallest(i, j)) {
        star1 += input[i][j] + 1;
        basins.push([i, j]);
      }
    }
  }

  let [big, medium, small] = [0, 0, 0];

  const computeBasinSize = ([row, col]: number[]) => {
    input[row][col] = 9;

    const stack = [[row, col]];

    for (const [i, j] of stack) {
      if (!isNaN(input[i - 1][j]) && input[i - 1][j] < 9) {
        stack.push([i - 1, j]);
        input[i - 1][j] = 9;
      }
      if (!isNaN(input[i][j + 1]) && input[i][j + 1] < 9) {
        stack.push([i, j + 1]);
        input[i][j + 1] = 9;
      }
      if (!isNaN(input[i + 1][j]) && input[i + 1][j] < 9) {
        stack.push([i + 1, j]);
        input[i + 1][j] = 9;
      }
      if (!isNaN(input[i][j - 1]) && input[i][j - 1] < 9) {
        stack.push([i, j - 1]);
        input[i][j - 1] = 9;
      }
    }

    const size = stack.length;

    if (size > big) {
      small = medium;
      medium = big;
      big = size;
    } else if (size > medium) {
      small = medium;
      medium = size;
    } else if (size > small) {
      small = size;
    }
  };

  basins.forEach(computeBasinSize);

  const star2 = big * medium * small;

  showTheResult({ star1, star2, path: __filename });
};

day9();
