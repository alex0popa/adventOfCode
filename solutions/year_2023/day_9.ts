
import { extractNumbers, sumArray } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getNewHistory = (history: number[]) => {
  const newHistory: number[] = [];

  for (let i = 0; i < history.length - 1; ++i) {
    newHistory.push(history[i + 1] - history[i]);
  }

  return newHistory;
}

const getFuture = (history: number[]): number => {
  if(history.every(number => number === 0)) return 0;

  const newHistory = getNewHistory(history);

  return history[history.length - 1] + getFuture(newHistory);
}

const getPast = (history: number[]): number => {
  const past: number[] = [];
  
  while (history.some(Boolean)) {
    past.unshift(history[0]);

    history = getNewHistory(history);;
  }
  
  return past.reduce((result, value) => value - result, 0);
};

(async () =>  {
  console.time('time');

  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  const star1 = sumArray(input.map(getFuture));
  const star2 = sumArray(input.map(getPast));

  showTheResult({ star1, star2, path: __filename });
})();
