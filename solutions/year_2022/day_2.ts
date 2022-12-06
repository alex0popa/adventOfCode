import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type RPS = 'R' | 'P' | 'S';
type ABC = 'A' | 'B' | 'C';
type XYZ = 'X' | 'Y' | 'Z';

const gamePoints = { R: 1, P: 2, S: 3 };
const winners = ['R-P', 'P-S', 'S-R'];

const getWinPoints = (elf: RPS, me: RPS) =>
  elf === me ? 3 : winners.includes(elf + '-' + me) ? 6 : 0;

const getObj = (s: ABC | XYZ, elfObj?: RPS) =>
  elfObj
    ? s === 'Y'
      ? elfObj
      : s === 'X'
      ? (winners.find((str) => str[2] === elfObj)![0] as RPS)
      : (winners.find((str) => str[0] === elfObj)![2] as RPS)
    : ['A', 'X'].includes(s)
    ? 'R'
    : ['B', 'Y'].includes(s)
    ? 'P'
    : 'S';

(async () => {
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((s) => s.split(' ')) as (ABC | XYZ)[][];

  const { star1, star2 } = input.reduce(
    ({ star1, star2 }, [a, b]) => {
      const elfObj = getObj(a);
      const myObj1 = getObj(b);
      const myObj2 = getObj(b, elfObj);

      star1 += getWinPoints(elfObj, myObj1) + gamePoints[myObj1];
      star2 += getWinPoints(elfObj, myObj2) + gamePoints[myObj2];

      return { star1, star2 };
    },
    { star1: 0, star2: 0 }
  );

  showTheResult({ star1, star2, path: __filename });
})();
