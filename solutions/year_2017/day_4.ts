import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const passphrases = (await getInputForDay(__filename)).trim().split('\n');

  let star1 = 0;
  let star2 = 0;

  for (const passphrase of passphrases) {
    const words = passphrase.split(' ');
    const wordsSet = new Set<string>(words);

    const anagrams = words.map((word) => word.split('').sort().join(''));
    const anagramsSet = new Set<string>(anagrams);

    if (words.length === wordsSet.size) ++star1;
    if (words.length === anagramsSet.size) ++star2;
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
