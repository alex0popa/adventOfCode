import { visitAround } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`
  .trim()
  .split('\n')
  .map((line) => line.split(''));

const getPositionsOfRollsThatCanBeRemoved = (matrix: string[][]) => {
  const positions = [];

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const char = matrix[row][col];

      if (char === '@') {
        const rollsAround = visitAround(row, col, (newRow, newCol): number =>
          matrix?.[newRow]?.[newCol] === '@' ? 1 : 0,
        ).reduce((a, b) => a + b);

        if (rollsAround < 4) positions.push({ row, col });
      }
    }
  }

  return positions;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  const star1 = getPositionsOfRollsThatCanBeRemoved(input).length;
  let star2 = 0;

  for (
    let positions = getPositionsOfRollsThatCanBeRemoved(input);
    positions.length > 0;
    positions = getPositionsOfRollsThatCanBeRemoved(input)
  ) {
    star2 += positions.length;

    for (const { row, col } of positions) {
      input[row][col] = '.';
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
