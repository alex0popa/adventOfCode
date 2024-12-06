import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const isOrdered = (rules: string[], pageNumbers: number[]) => {
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
 * However, we can see that the target number is in the middle array.  
 */
const getMiddlePageFromUnordered = (rules: string[], pageNumbers: number[]) => {
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

    // last number is always without pair
    if (map[pageNumber].length === 0) {
      delete map[pageNumber];
      lastNumber = pageNumber;
    }
  }

  const orderedPageNumbers = Object.entries(map)
    // extract pairs
    .map(([, pairs]) => pairs)
    // sort by number of pairs
    .sort((pair1, pair2) => pair1.length - pair2.length)
    // get the first half, at the half we have the target number
    .slice(0, (pageNumbers.length - 1) / 2);

  for (const pairs of orderedPageNumbers) {
    for (const pair of pairs) {
      const [front, back] = pair.split('|').map(Number);

      if (back === lastNumber) {
        lastNumber = front;
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

  for (const line of pages) {
    const pageNumbers = extractNumbers(line);

    if (isOrdered(rules, pageNumbers)) {
      star1 += pageNumbers[(pageNumbers.length - 1) / 2];

      continue;
    }

    star2 += getMiddlePageFromUnordered(rules, pageNumbers);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
