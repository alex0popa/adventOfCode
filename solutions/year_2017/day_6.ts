import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const chosenBankIdx = (banks: number[]) => {
  let idx = 0;
  let max = 0;

  for (let i = idx; i < banks.length; ++i) {
    if (max < banks[i]) {
      max = banks[i];
      idx = i;
    }
  }

  return idx;
};

(async () => {
  console.time('time');
  const banks = extractNumbers(
    (await getInputForDay(__filename)).trim().split('\n')[0],
  );
  let star1 = -1;
  let star2 = 0;
  let star2Key = '';
  const set = new Set<string>();

  set.add(banks.join('-'));

  while (true) {
    const idx = chosenBankIdx(banks);

    let blocks = banks[idx];

    banks[idx] = 0;

    for (let i = idx + 1; blocks > 0; ++i) {
      banks[i % banks.length] += 1;
      --blocks;
    }

    if (set.has(banks.join('-'))) {
      if (star1 === -1) {
        star1 = set.size;
        star2Key = banks.join('-');
      } else if (star2Key === banks.join('-')) break;
    }

    if (star2Key !== '') ++star2;

    set.add(banks.join('-'));
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
