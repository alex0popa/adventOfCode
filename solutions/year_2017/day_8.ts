import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const operators: { [key: string]: (a: number, b: number) => boolean } = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '==': (a, b) => a == b,
  '===': (a, b) => a === b,
  '!=': (a, b) => a != b,
  '!==': (a, b) => a !== b,
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const map: { [key: string]: number } = {};
  let maxValue = -Infinity;

  for (const row of input) {
    const [
      register,
      operation,
      value,
      ,
      conditionRegister,
      conditionOperator,
      conditionValue,
    ] = row.split(' ');

    if (typeof map[register] === 'undefined') {
      map[register] = 0;
    }

    if (typeof map[conditionRegister] === 'undefined') {
      map[conditionRegister] = 0;
    }

    const evalCondition = operators[conditionOperator];

    if (evalCondition(map[conditionRegister], +conditionValue)) {
      map[register] += (operation === 'inc' ? 1 : -1) * +value;

      if (map[register] > maxValue) {
        maxValue = map[register];
      }
    }
  }

  const star1 = Math.max(...Object.values(map));

  showTheResult({ star1, star2: maxValue, path: __filename });
  console.timeEnd('time');
})();
