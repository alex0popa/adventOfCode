import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Symbol = '+' | '||' | '*';

const getResultForCombination = (combination: Symbol[], numbers: number[]) => {
  return numbers.slice(1).reduce((acc, num, idx) => {
    if (combination[idx] === '+') {
      return acc + num;
    }

    if (combination[idx] === '||') {
      return +`${acc}${num}`;
    }

    return acc * num;
  }, numbers[0]);
};

const getValueForCalibration = (input: string, symbols: Symbol[]) => {
  const [result, ...numbers] = extractNumbers(input);
  let isCorrect = false;

  function generate(current: Symbol[], depth: number) {
    if (depth === numbers.length - 1) {
      const combinationResult = getResultForCombination(current, numbers);

      isCorrect = combinationResult === result;

      return;
    }

    for (const symbol of symbols) {
      current[depth] = symbol;
      generate(current, depth + 1);

      if (isCorrect) return;
    }
  }

  generate([], 0);

  return isCorrect ? result : 0;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  let star1 = 0;
  let star2 = 0;

  for (const line of input) {
    star1 += getValueForCalibration(line, ['+', '*']);
    star2 += getValueForCalibration(line, ['+', '||', '*']);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
