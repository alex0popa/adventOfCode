import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(Number);

  const star1 = input.reduce((a, b) => a + b);
  const set = new Set<number>();
  let star2 = -Infinity;

  for (let i = 0, freq = 0; star2 === -Infinity; i = (i + 1) % input.length) {
    freq += input[i];

    if (set.has(freq)) star2 = freq;

    set.add(freq);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
