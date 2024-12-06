import { directionsVectorMap } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const directions = ['N', 'E', 'S', 'W'] as const;

const getStar1 = (input: string[][]) => {
  let row = input.findIndex((row) => row.includes('^'));
  let col = input[row].findIndex((cell) => cell === '^');
  let dirIdx = 0;
  let visited = 0;

  input[row][col] = '.';

  while (input[row]?.[col] !== undefined) {
    if (input[row][col] === '.') {
      input[row][col] = String(++visited);
    }

    let [dRow, dCol] = directionsVectorMap[directions[dirIdx]];

    if (input[row + dRow]?.[col + dCol] === '#') {
      dirIdx = (dirIdx + 1) % 4;

      [dRow, dCol] = directionsVectorMap[directions[dirIdx]];
    }

    row += dRow;
    col += dCol;
  }

  return visited;
};

const getStar2 = (puzzle: string[][]) => {
  const startRow = puzzle.findIndex((row) => row.includes('^'));
  const startCol = puzzle[startRow].findIndex((cell) => cell === '^');
  const startDirIdx = 0;
  let loops = 0;

  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if ((i === startRow && j === startCol) || puzzle[i][j] === '#') continue;

      const visited = new Set<string>();
      const input = puzzle.map((row) => [...row]);
      input[i][j] = '#';

      let row = startRow;
      let col = startCol;
      let dirIdx = startDirIdx;

      while (input[row]?.[col]) {
        const [dRow, dCol] = directionsVectorMap[directions[dirIdx]];
        const nextCell = input[row + dRow]?.[col + dCol];

        if (nextCell === '#') {
          const stateKey = `${row}-${col}-${dirIdx}`;
          if (visited.has(stateKey)) {
            loops++;
            break;
          }

          visited.add(stateKey);

          dirIdx = (dirIdx + 1) % 4;

          continue;
        }
        row += dRow;
        col += dCol;
      }
    }
  }

  return loops;
};

(async () => {
  console.time('time');
  const puzzle = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  const star1 = getStar1(puzzle.map((row) => [...row]));
  const star2 = getStar2(puzzle.map((row) => [...row]));

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();

// 1665 is too high
