import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const isOrdered = (rulesSet: Set<string>, pageNumbers: number[]) => {
  let matchedRules = 0;

  for (let i = 1; i < pageNumbers.length; ++i) {
    if (rulesSet.has(`${pageNumbers[i - 1]}|${pageNumbers[i]}`)) {
      matchedRules++;
    }
  }

  return matchedRules === pageNumbers.length - 1;
};

const getMiddlePageFromUnordered = (
  rulesSet: Set<string>,
  pageNumbers: number[],
) => {
  for (const pageNumber of pageNumbers) {
    let matchedRules = 0;

    for (const num of pageNumbers) {
      if (num !== pageNumber && rulesSet.has(`${pageNumber}|${num}`)) {
        matchedRules++;
      }
    }

    if (matchedRules === (pageNumbers.length - 1) / 2) return pageNumber;
  }

  return 0;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const emptyLineIdx = input.findIndex((line) => line.length < 5);
  const rules = input.slice(0, emptyLineIdx);
  const rulesSet = new Set(rules);
  const pages = input.slice(emptyLineIdx + 1);
  let star1 = 0;
  let star2 = 0;

  for (const line of pages) {
    const pageNumbers = extractNumbers(line);

    if (isOrdered(rulesSet, pageNumbers)) {
      star1 += pageNumbers[(pageNumbers.length - 1) / 2];

      continue;
    }

    star2 += getMiddlePageFromUnordered(rulesSet, pageNumbers);
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
