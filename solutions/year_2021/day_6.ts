import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const freq = new Array(9).fill(0);

const getTheStar = (days: number) => {
  while (days--) {
    freq[8] = freq.shift();
    freq[6] += freq[8];
  }

  return freq.reduce((a, c) => a + c);
};

(async () => {
  (await getInputForDay(__filename))
    .split(',')
    .forEach((fish) => ++freq[+fish]);

  const [star1, star2] = [getTheStar(80), getTheStar(256 - 80)];

  showTheResult({ star1, star2, path: __filename });
})();
