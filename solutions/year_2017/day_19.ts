import { getAlphabet } from '../../helpers/string';
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
  const row = 0;
  const col = input[row].indexOf('|');
  const execute = true;
  const direction: typeof VERTICAL | typeof HORIZONTAL = VERTICAL;
  const step: 1 | -1 = 1;

  // while(execute) {
  //   while(input[row][++col] !== PLUS) {

  //   }

  // }

  console.log({ row, col, ALFABET });

  // console.log(input);

  showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
