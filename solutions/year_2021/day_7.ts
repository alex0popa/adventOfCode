import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const computeConsum = (steps: number, consum = 0) => {
  while (steps) consum += steps--;

  return consum;
};

(async () => {
  const input = (await getInputForDay(__filename)).split(',').map((e) => +e);
  const maxPosition = Math.max(...input) + 1;

  const getStar = (star: number) =>
    Math.min(
      ...[...Array(maxPosition)].map((_, actualPosition) =>
        input
          .map((crabPosition) =>
            star === 1
              ? Math.abs(crabPosition - actualPosition)
              : computeConsum(Math.abs(crabPosition - actualPosition))
          )
          .reduce((a, c) => a + c)
      )
    );

  const star1 = getStar(1);
  const star2 = getStar(2);

  showTheResult({ star1, star2, path: __filename });
})();
