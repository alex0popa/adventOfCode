import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const isCorrectOrder = (rules: string[], pageNumbers: number[]) => {
  for (let i = 1; i < pageNumbers.length; ++i) {
    if (!rules.includes(`${pageNumbers[i - 1]}|${pageNumbers[i]}`)) {
      return false;
    }
  }
  return true;
};

/**
 * There is always a number without pair, so it go to the last place.
 * All others have pairs, bur all have a different number of pairs.
 *
 * Ordering by number of pairs we see that every lastNumber has only a match on the next array of pairs.
 * 
 * Use this log to visualize:
 * 
 * console.log('\n', pageNumbers.join(', '), '\n');
 * Object.entries(map)
 *  .sort((a, b) => a[1].length - b[1].length)
 * .forEach(([pageNumber, nums]) => {
 *    console.log(`${pageNumber} => ${nums.join(', ')}`);
 *  });
  console.log('\n###################################\n');
 *
 * However, we can see that the target number is in the middle  array.  
 */
const determineMiddlePageFromRules = (
  rules: string[],
  pageNumbers: number[],
) => {
  const map: { [key: number]: string[] } = {};
  let lastNumber = 0;

  for (let i = 0; i < pageNumbers.length; ++i) {
    const pageNumber = pageNumbers[i];
    map[pageNumber] = [];

    for (const num of pageNumbers) {
      if (num !== pageNumber) {
        if (rules.includes(`${pageNumber}|${num}`)) {
          map[pageNumber].push(`${pageNumber}|${num}`);
        }
      }
    }

    if (map[pageNumber].length === 0) {
      delete map[pageNumber];
      lastNumber = pageNumber;
    }
  }

  const orderedPageNumbers = Object.entries(map)
    .sort((a, b) => a[1].length - b[1].length)
    .map(([, pageNumber]) => pageNumber)
    .slice(0, (pageNumbers.length - 1) / 2);

  for (const pairs of orderedPageNumbers) {
    for (const pair of pairs) {
      const [a, b] = extractNumbers(pair);

      if (b === lastNumber) {
        lastNumber = a;
        break;
      }
    }
  }

  return lastNumber;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const emptyLineIdx = input.findIndex((line) => line.length < 5);
  const rules = input.slice(0, emptyLineIdx);
  const pages = input.slice(emptyLineIdx + 1);
  let star1 = 0;
  let star2 = 0;

  let x = 0;

  for (const line of pages) {
    const pageNumbers = extractNumbers(line);
    if (isCorrectOrder(rules, pageNumbers)) {
      star1 += pageNumbers[(pageNumbers.length - 1) / 2];

      continue;
    }

    star2 += determineMiddlePageFromRules(rules, pageNumbers);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
