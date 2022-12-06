import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getResult = (matrixList: string[][][]) =>
  matrixList.map((matrix) => matrix.map((arr) => arr.slice(-1)[0]).join(''));

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const movesStartIndex = input.findIndex((s) => s.includes('move'));

  const stacks1 = input
    .slice(0, movesStartIndex - 2)
    .reverse()
    .reduce<string[][]>(
      (arr, s) => {
        for (let i = 1, pos = 0; i < s.length; i += 4, ++pos) {
          s[i] !== ' ' && arr[pos].push(s[i]);
        }

        return arr;
      },
      [...Array(movesStartIndex - 1)].map(() => [])
    );

  const stacks2 = [...stacks1];

  input.slice(movesStartIndex).forEach((line) => {
    const [quantity, from, to] = line.split(' ').reduce<number[]>(
      (arr, str) =>
        // 'from' and 'to' start from 1, my stacks arrays start from 0
        isNaN(+str) ? arr : [...arr, arr.length ? +str - 1 : +str],
      []
    );

    [stacks1, stacks2].forEach((stack, i) => {
      const section = stack[from].slice(-quantity);
      !i && section.reverse();

      stack[to] = [...stack[to], ...section];
      stack[from] = stack[from].slice(0, -quantity);
    });
  });

  const [star1, star2] = getResult([stacks1, stacks2]);

  showTheResult({ star1, star2, path: __filename });
})();
