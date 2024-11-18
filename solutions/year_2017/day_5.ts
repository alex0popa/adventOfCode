import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getStar = (instructions: number[], part: 'one' | 'two') => {
  const jumps = [...instructions];
  let steps = 0;
  let position = 0;

  while (position >= 0 && position < jumps.length) {
    const currentOffset = jumps[position];
    jumps[position] += part === 'two' && currentOffset > 2 ? -1 : 1;
    position += currentOffset;
    steps++;
  }

  return steps;
};

(async () => {
  console.time('time');
  const instructions = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(Number);

  const star1 = getStar(instructions, 'one');
  const star2 = getStar(instructions, 'two');

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
