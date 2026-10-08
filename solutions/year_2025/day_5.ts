import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputX = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`.split('\n');

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const ranges: number[][] = [];

  let star1 = 0;

  for (const line of input) {
    if (line.includes('-')) {
      const [start, end] = line.split('-').map(Number);

      ranges.push([start, end]);

      continue;
    }

    if (isNaN(Number(line))) continue;

    for (const [start, end] of ranges) {
      if (+line >= start && +line <= end) {
        ++star1;
        break;
      }
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);

  let star2 = 0;
  for (let i = 1, actualRange = ranges[0]; i < ranges.length; i++) {
    const [nextRangeStart, nextRangeEnd] = ranges[i];

    if (nextRangeStart > actualRange[1]) {
      star2 += actualRange[1] - actualRange[0] + 1;
      actualRange = ranges[i];

      continue;
    }

    actualRange[1] = Math.max(actualRange[1], nextRangeEnd);

    if (i === ranges.length - 1) {
      star2 += actualRange[1] - actualRange[0] + 1;
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
