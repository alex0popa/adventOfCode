import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  let star1 = 0;
  let star2 = 0;

  for (const row of input) {
    star1 += Math.max(...row) - Math.min(...row);

    for (let i = 0; i < row.length; i++) {
      for (let j = i + 1; j < row.length; j++) {
        if (row[i] % row[j] === 0) star2 += row[i] / row[j];
        if (row[j] % row[i] === 0) star2 += row[j] / row[i];
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
