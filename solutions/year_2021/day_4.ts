import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type El = string | number;
type Board = El[][];

(async () => {
  const input = (await getInputForDay(__filename)).split('\n\n');

  const nrs = input.shift()!.split(',');

  const boards: Board[] = input.map((board) =>
    board.split('\n').map((el) => el.split(' ').filter((el) => el))
  );

  const isNumber = (el: El) => typeof el === 'number';

  const getSum = (board: Board) =>
    board
      .flat()
      .reduce((sum: number, el) => (isNumber(el) ? sum : sum + +el), 0);

  /**
   * Check if row or column is complete (all its elements are numbers)
   */
  const isCompleteRowOrCol = (board: Board, line: El[], col: number) =>
    line.every(isNumber) ||
    board.map((_, row) => board[row][col]).every(isNumber);

  let [x, star1, star2] = [0, 0, 0];

  const asignStarValue = (board: Board, nr: string) => {
    const sum = getSum(board);
    const finalScore = sum * +nr;

    x === 1 ? (star1 = finalScore) : (star2 = finalScore);
  };

  for (let i = 0; x < boards.length; ++i) {
    const nr = nrs[i];

    for (let j = 0; j < boards.length; ++j) {
      const board = boards[j];

      for (let k = 0; k < board.length; ++k) {
        const line = board[k];

        for (let l = 0; l < line.length; ++l) {
          if (line[l] === nr) {
            line[l] = +nr;

            if (isCompleteRowOrCol(board, line, l)) {
              ++x;
              (x === boards.length || x === 1) && asignStarValue(board, nr);
              boards[j] = [];
            }
          }
        }
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();
