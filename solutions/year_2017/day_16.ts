import { extractNumbers, getAlphabet } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const BILLION = 10 ** 9;

const dance = (programs: string[], moves: ['s' | 'x' | 'p', string][]) => {
  for (const [dance, values] of moves) {
    if (dance === 's') {
      const sliceFrom = +values;

      programs = [
        ...programs.slice(-sliceFrom),
        ...programs.slice(0, -sliceFrom),
      ];

      continue;
    }

    if (dance === 'x') {
      const [positionA, positionB] = extractNumbers(values);
      [programs[positionA], programs[positionB]] = [
        programs[positionB],
        programs[positionA],
      ];

      continue;
    }

    if (dance === 'p') {
      const [programNameA, programNameB] = values.split('/');
      const positionA = programs.findIndex((item) => item === programNameA);
      const positionB = programs.findIndex((item) => item === programNameB);
      [programs[positionA], programs[positionB]] = [
        programs[positionB],
        programs[positionA],
      ];

      continue;
    }

    throw new Error(`Dance [${dance}] not allowed`);
  }

  return programs;
};

(async () => {
  console.time('time');

  const moves = (await getInputForDay(__filename))
    .trim()
    .split('\n')[0]
    .split(',')
    .map((item) => [item[0], item.slice(1)]) as ['x' | 'p' | 's', string][];

  let programs = getAlphabet('a').slice(0, 16);

  programs = dance(programs, moves);

  const star1 = programs.join('');

  const set = new Set<string>();

  for (let key = programs.join(''); !set.has(key); key = programs.join('')) {
    set.add(key);

    programs = dance(programs, moves);
  }

  const star2 = Array.from(set)[(BILLION % set.size) - 1];

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
