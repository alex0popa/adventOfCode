import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const findMoves = ({
  a,
  b,
  target,
}: {
  a: number;
  b: number;
  target: number;
}) => {
  const result: string[] = [];

  for (let i = 1; i * a <= target || i * b <= target; i++) {
    const j = (target - b * i) / a;

    if (Number.isInteger(j)) {
      result.push(`${j}#${i}`);
    }
  }

  return result;
};

const [aTokens, bTokens, delta] = [3, 1, 10000000000000];

const input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`
  .trim()
  .split('\n');

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');

  let tokens = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] && i + 2 < input.length) {
      const [xA, yA] = extractNumbers(input[i++]);
      const [xB, yB] = extractNumbers(input[i++]);
      const [xTarget, yTarget] = extractNumbers(input[i++]);

      const xs = findMoves({ a: xA, b: xB, target: xTarget });
      const ys = findMoves({ a: yA, b: yB, target: yTarget });

      for (const item of xs) {
        if (ys.includes(item)) {
          const [aMoves, bMoves] = extractNumbers(item);
          const tok = aMoves * aTokens + bMoves * bTokens;

          // console.log({ aMoves, bMoves, tok });

          tokens += tok;

          break;
        }
      }
    }
  }

  showTheResult({ star1: tokens, star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
