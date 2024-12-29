import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');

  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')[0]
    .split(' ');

  let numMap = input.reduce<{ [key: string]: number }>((acc, nr) => {
    acc[nr] = (acc[nr] || 0) + 1;
    return acc;
  }, {});

  let star1 = 0;

  for (let i = 1; i <= 75; i++) {
    const newNumMap: { [key: string]: number } = {};

    for (const [nr, val] of Object.entries(numMap)) {
      if (+nr === 0) {
        newNumMap['1'] = (newNumMap['1'] || 0) + val;

        continue;
      }

      if (nr.length % 2 === 0) {
        const key1 = String(+nr.slice(0, Math.floor(nr.length / 2)));
        const key2 = String(+nr.slice(Math.floor(nr.length / 2)));

        newNumMap[key1] = (newNumMap[key1] || 0) + val;
        newNumMap[key2] = (newNumMap[key2] || 0) + val;

        continue;
      }

      const key = String(+nr * 2024);

      newNumMap[key] = (newNumMap[key] || 0) + val;
    }

    numMap = { ...newNumMap };

    if (i === 25) {
      star1 = Object.values(numMap).reduce((acc, val) => acc + val, 0);
    }
  }

  showTheResult({
    star1,
    star2: Object.values(numMap).reduce((acc, val) => acc + val, 0),
    path: __filename,
  });

  console.timeEnd('time');
})();
