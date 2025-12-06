import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX = `987654321111111
811111111111119
234234234234278
818181911112111`.split('\n');

const findBiggestValue = (input: string) => {
  let idx = 0;
  let biggestValue = 0;

  input.split('').forEach((char, index) => {
    if (+char > biggestValue) {
      biggestValue = +char;
      idx = index;
    }
  });

  return { biggestValue, idx };
};

const computeJoltage = (line: string, digits: number) => {
  let joltage = '';

  for (let i = digits, startIdx = 0; i > 0; --i) {
    const { biggestValue, idx } = findBiggestValue(
      line.slice(startIdx, i === 1 ? undefined : -i + 1),
    );

    joltage += biggestValue;
    startIdx += idx + 1;
  }

  return Number(joltage);
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  let star1 = 0;
  let star2 = 0;

  for (const line of input) {
    star1 += computeJoltage(line, 2);
    star2 += computeJoltage(line, 12);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
