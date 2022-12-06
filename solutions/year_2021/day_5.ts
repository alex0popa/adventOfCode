import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename)).split('\n').map((l) =>
    l
      .split(' -> ')
      .map((c) => c.split(','))
      .flat()
      .map(Number)
  );

  const map = [...Array(1000)].map(() => [...Array(1000)].map(() => 0));

  const getTheStar = () => map.flat().reduce((a, c) => (c > 1 ? ++a : a), 0);

  input.forEach(([x1, y1, x2, y2]) => {
    if (x1 === x2) {
      // horizontal
      y1 > y2 && ([y1, y2] = [y2, y1]);

      while (y1 <= y2) ++map[y1++][x1];
    } else if (y1 === y2) {
      // vertical
      x1 > x2 && ([x1, x2] = [x2, x1]);

      while (x1 <= x2) ++map[y1][x1++];
    }
  });

  const star1 = getTheStar();

  input.forEach(([x1, y1, x2, y2]) => {
    // diagonals
    if (x1 + y1 === x2 + y2 || x1 - y1 === x2 - y2) {
      x1 > x2 && ([x1, y1, x2, y2] = [x2, y2, x1, y1]);

      while (x1 <= x2) ++map[x1 - y1 === x2 - y2 ? y1++ : y1--][x1++];
    }
  });

  const star2 = getTheStar();

  showTheResult({ star1, star2, path: __filename });
})();
