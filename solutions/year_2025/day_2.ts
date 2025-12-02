import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX =
  '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'
    .split(',')
    .map((line) => line.split('-').map(Number));

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split(',')
    .map((line) => line.split('-').map(Number));

  let star1 = 0,
    star2 = 0;

  const computeStar1 = (target: number) => {
    const string = String(target);
    const middle = string.length / 2;

    if (middle % 2 === 0) {
      const middle = string.length / 2;
      const firstHalf = string.slice(0, middle);
      const secondHalf = string.slice(middle);

      if (firstHalf === secondHalf) {
        star1 += target;
      }
    }
  };

  const computeStar2 = (target: number) => {
    const string = String(target);
    const middle = string.length / 2;

    for (let idx = 1; idx <= middle; idx++) {
      const subString = string.slice(0, idx);
      const set = new Set(string.split(subString));

      if (set.size === 1) {
        star2 += target;
        break;
      }
    }
  };

  for (let [i, j] of input) {
    while (i <= j) {
      computeStar1(i);
      computeStar2(i);
      ++i;
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
