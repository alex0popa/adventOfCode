import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  let star1 = 0;
  let star2 = 0;
  let dialPointing = 50;

  for (const line of input) {
    const direction = line[0] as 'L' | 'R';

    const value = (direction === 'R' ? 1 : -1) * +line.slice(1);

    const nextDial = dialPointing + value;

    /**
     *  Count boundary crossings (full rotations), regardless of direction
     *
     * Example:
     *   - if value is 234 and value is 70 on the right, then we need to count 3 full rotations 234 + 70 = 304
     *   - if value is 234 and value is 20 on the right, then we need to count 2 full rotations 234 + 20 = 254
     *   - if value is 234 and value is 70 on the left, then we need to count 1 full rotation 234 - 70 = 164
     *   - if value is 234 and value is 20 on the left, then we need to count 2 full rotations 234 - 20 = 214
     */
    star2 += Math.abs(Math.floor(nextDial / 100));

    // Normalize dial to 0..99
    dialPointing = ((nextDial % 100) + 100) % 100;

    if (dialPointing === 0) {
      ++star1;
    }
  }

  showTheResult({
    star1,
    star2,
    path: __filename,
  });
  console.timeEnd('time');
})();
