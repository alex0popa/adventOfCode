import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

const computeStar1 = (input: string) => {
  const matrix = input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .filter(Boolean)
        .map((item) => (isNaN(Number(item)) ? item : Number(item))),
    );

  matrix.unshift(matrix.pop()!);

  let star1 = 0;
  for (let col = 0; col < matrix[0].length; col++) {
    let operation = matrix[0][col];
    let sum = 0;
    let mult = 1;

    for (let row = 1; row < matrix.length; row++) {
      const item = matrix[row][col];
      if (typeof item === 'number') {
        if (operation === '+') {
          sum += item;
        } else {
          mult *= item;
        }
      }
    }

    star1 += operation === '+' ? sum : mult;
  }

  return star1;
};

const computeStar2 = (input: string) => {
  const matrix = input.split('\n');

  let star2 = 0,
    operation = '+',
    sum = 0,
    mult = 1;

  for (let col = 0; col < matrix[0].length; col++) {
    let str = '';

    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][col] !== ' ') {
        str += matrix[row][col];
      }
    }

    if (str.length > 0) {
      if (isNaN(Number(str))) {
        if (operation === '+') {
          star2 += sum;
        } else if (col > 0) {
          star2 += mult;
        }

        operation = str.slice(-1)[0];
        str = str.slice(0, -1);

        sum = 0;
        mult = 1;
      }

      if (operation === '+') {
        sum += Number(str);
      } else {
        mult *= Number(str);
      }
    }
  }

  return star2 + (operation === '*' ? mult : sum);
};

(async () => {
  console.time('time');
  const input = await getInputForDay(__filename);

  showTheResult({
    star1: computeStar1(input),
    star2: computeStar2(input),
    path: __filename,
  });
  console.timeEnd('time');
})();
