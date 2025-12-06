import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`
  .trim()
  .split('\n');

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  let star1 = 0;
  let star2 = 0;
  let dialPointing = 50;

  for (const line of input) {
    const dir = line[0] as 'L' | 'R';
    let value = +line.slice(1);

    star2 += Math.floor(value / 100);
    value %= 100;

    if (dir === 'L') {
      const delta = dialPointing - value;

      if ((dialPointing !== 0 && delta < 0) || delta === 0) {
        ++star2;
      }

      dialPointing = delta + (delta < 0 ? 100 : 0);
    }

    if (dir === 'R') {
      dialPointing += value;

      star2 += Math.floor(dialPointing / 100);
      dialPointing %= 100;
    }

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
