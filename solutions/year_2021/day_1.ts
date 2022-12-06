import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Stars = { star1: number; star2: number };

const INITIAL_STARS = { star1: 0, star2: 0 };

(async () => {
  const input = (await getInputForDay(__filename)).split('\n').map(Number);

  const MAX_POS = input.length - 3;

  const computeValues = ({ star1, star2 }: Stars, val: number, i: number) => ({
    star1: i && val > input[i - 1] ? ++star1 : star1,
    star2: i < MAX_POS && val < input[i + 3] ? ++star2 : star2,
  });

  const { star1, star2 } = input.reduce(computeValues, INITIAL_STARS);

  showTheResult({ star1, star2, path: __filename });
})();
