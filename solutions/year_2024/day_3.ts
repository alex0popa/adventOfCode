import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const DO_MUL = 'do()';
const DONT_MUL = "don't()";

/**
 * mul(number,number)
 */
const NORMAL_MUL_REGEX = /mul\(\d+,\d+\)/g;

/**
 * mul(number,number) or do() or don't()
 */
const DO_MUL_REGEX = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;

const extractMuls = (input: string, regex: RegExp) => {
  const matches = input.match(regex);

  if (matches) return matches;

  throw new Error('No matches found for extractMuls.');
};

const getStar = (muls: string[]) => {
  let canMul = true;
  let star = 0;

  for (const mul of muls) {
    if (mul === DO_MUL) {
      canMul = true;
      continue;
    }

    if (mul === DONT_MUL) {
      canMul = false;
      continue;
    }

    if (canMul) {
      const [a, b] = extractNumbers(mul);
      star += a * b;
    }
  }

  return star;
};

(async () => {
  console.time('time');
  const memory = (await getInputForDay(__filename)).trim();
  const star1 = getStar(extractMuls(memory, NORMAL_MUL_REGEX));
  const star2 = getStar(extractMuls(memory, DO_MUL_REGEX));

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
