import { aroundDirectionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const X_MAS = 'XMAS';
const A_MAS = ['MSAMS', 'SMASM', 'MMASS', 'SSAMM'];

const searchXmas = (input: string[], row: number, col: number) => {
  let app = 0;
  for (const direction of aroundDirectionsVector) {
    let str = input[row][col];
    const [dRow, dCol] = direction;

    for (let i = 1; i < X_MAS.length; i++) {
      const newRow = row + dRow * i;
      const newCol = col + dCol * i;

      str += input[newRow]?.[newCol] ?? '';
    }

    if (str === X_MAS) app++;
  }

  return app;
};

const searchMas = (input: string[], row: number, col: number) => {
  const LU = input[row - 1]?.[col - 1] ?? '';
  const RU = input[row - 1]?.[col + 1] ?? '';
  const LD = input[row + 1]?.[col - 1] ?? '';
  const RD = input[row + 1]?.[col + 1] ?? '';

  return A_MAS.includes(`${LU}${RU}${input[row][col]}${LD}${RD}`);
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  let star1 = 0;
  let star2 = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === 'X') {
        star1 += searchXmas(input, row, col);
      }

      if (input[row][col] === 'A' && searchMas(input, row, col)) {
        star2++;
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
