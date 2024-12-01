import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getSeverityByDelay = (scanners: number[], delay: number) => {
  let severity = 0;
  let gotCaught = false;

  for (let i = 0; i < scanners.length; ++i) {
    const range = scanners[i];
    if (range) {
      const scannerPosition = (i + delay) % (range * 2 - 2);

      if (scannerPosition === 0) {
        severity += i * range;
        gotCaught = true;
      }
    }
  }

  return { severity, gotCaught };
};

const inputX = [
  [0, 3],
  [1, 2],
  [4, 4],
  [6, 4],
];
(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  const arrLength = Math.max(...input.map(([depth]) => depth)) + 1;
  const scanners = [...Array(arrLength)].map(() => 0);

  for (const [depth, range] of input) scanners[depth] = range;

  const { severity: star1 } = getSeverityByDelay(scanners, 0);
  let delay = 0;

  while (getSeverityByDelay(scanners, delay).gotCaught) {
    delay++;
  }

  showTheResult({ star1, star2: delay, path: __filename });
  console.timeEnd('time');
})();
