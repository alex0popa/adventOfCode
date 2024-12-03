import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  const leftList = input.map(([left]) => left).sort((a, b) => a - b);
  const rightList = input.map(([, right]) => right).sort((a, b) => a - b);
  const rightAppearances: number[] = [];
  let star1 = 0;

  for (let i = 0; i < input.length; i++) {
    star1 += Math.abs(leftList[i] - rightList[i]);
    rightAppearances[rightList[i]] = (rightAppearances[rightList[i]] || 0) + 1;
  }

  const star2 = leftList.reduce(
    (sum, num) => sum + num * (rightAppearances[num] ?? 0),
    0,
  );

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
