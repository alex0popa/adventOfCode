import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const isSafeLevel = (level: number) => level >= 1 && level <= 3;
const isSafeReport = (report: number[]) => {
  let increasingChecks = 0;
  let decreasingChecks = 0;

  for (let i = 1; i < report.length; i++) {
    const increaseValue = report[i] - report[i - 1];
    const decreaseValue = report[i - 1] - report[i];

    if (isSafeLevel(increaseValue)) increasingChecks++;
    if (isSafeLevel(decreaseValue)) decreasingChecks++;
  }

  return (
    increasingChecks === report.length - 1 ||
    decreasingChecks === report.length - 1
  );
};

const isSafeProblemDampener = (report: number[]) => {
  for (let i = 0; i < report.length; i++) {
    const newReport = report.slice(0, i).concat(report.slice(i + 1));

    if (isSafeReport(newReport)) return true;
  }

  return false;
};

(async () => {
  console.time('time');
  const reports = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  let star1 = 0;
  let star2 = 0;

  for (const report of reports) {
    if (isSafeReport(report)) {
      star1++;
      star2++;

      continue;
    }

    if (isSafeProblemDampener(report)) ++star2;
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
