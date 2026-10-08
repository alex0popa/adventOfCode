import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { extractNumbers } from '../../helpers/string';

const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
  .trim()
  .split('\n')
  .map(extractNumbers);

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  let star1 = 0;

  for (let i = 0; i < input.length - 1; i++) {
    const [x1, y1] = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const [x2, y2] = input[j];

      const distance = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

      if (distance > star1) {
        star1 = distance;
      }
    }
  }

  showTheResult({ star1, star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
