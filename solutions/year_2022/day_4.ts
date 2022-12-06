import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const { star1, star2 } = input.reduce(
    ({ star1, star2 }, pair) => {
      const [[a1, a2], [b1, b2]] = pair
        .split(',')
        .map((el) => el.split('-').map(Number));

      ((a1 <= b1 && a2 >= b2) || (b1 <= a1 && b2 >= a2)) && ++star1;

      ((a1 >= b1 && a1 <= b2) ||
        (a2 >= b1 && a2 <= b2) ||
        (b1 >= a1 && b1 <= a2) ||
        (b2 >= a1 && b2 <= a2)) &&
        ++star2;

      return { star1, star2 };
    },
    { star1: 0, star2: 0 }
  );

  showTheResult({ star1, star2, path: __filename });
})();
