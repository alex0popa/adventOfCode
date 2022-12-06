import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename)).split('\n').map(Number);

  const top3Elves = input
    .reduce<{ arr: number[]; total: number }>(
      ({ arr, total }, nr) => ({
        arr: !nr ? arr.concat([total]) : arr,
        total: !nr ? nr : total + nr,
      }),
      { arr: [], total: 0 }
    )
    .arr.sort((a, b) => b - a)
    .slice(0, 3);

  const star1 = top3Elves[0];
  const star2 = top3Elves.reduce((t, a) => t + a);

  showTheResult({ star1, star2, path: __filename });
})();
