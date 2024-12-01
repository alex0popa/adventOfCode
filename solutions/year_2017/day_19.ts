import { getAlphabet } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const VERTICAL = '|';
const HORIZONTAL = '-';
const PLUS = '+';
const EMPTY = ' ';
const ALFABET = getAlphabet('A');

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).split('\n');
  const letters: string[] = [];
  let row = 0;
  let col = input[row].indexOf('|');
  let execute = true;
  let direction: typeof VERTICAL | typeof HORIZONTAL = VERTICAL;
  let step: 1 | -1 = 1;

  // while(execute) {
  //   while(input[row][++col] !== PLUS) {

  //   }

  // }

  console.log({ row, col, ALFABET });

  // console.log(input);

  showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
