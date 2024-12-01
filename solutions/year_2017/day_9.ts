import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const inputx = '<{o"i!a,<{i<a>';

(async () => {
  console.time('time');

  const [input] = (await getInputForDay(__filename)).trim().split('\n');
  let stream = '';
  let star1 = 0;
  let star2 = 0;

  for (let i = 0, isGarbage = false; i < input.length; i++) {
    const char = input[i];

    if (char === '!') {
      ++i;
      continue;
    }

    if (isGarbage) {
      if (char === '>') {
        isGarbage = false;
      } else {
        ++star2;
      }

      continue;
    }

    if (char === '<') {
      isGarbage = true;

      continue;
    }

    if (char !== ',') stream += char;
  }

  while (stream.length) {
    const index = stream.indexOf('}');

    star1 += index;

    stream = stream.slice(0, index - 1) + stream.slice(index + 1);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
