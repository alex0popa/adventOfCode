import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename)).trim();

  let star1 = 0;
  let star2 = 0;

  const isMarker = (index: number, length: number) =>
    new Set(input.slice(index - length, index).split('')).size === length;

  for (let index = 4; index < input.length; index++) {
    !star1 && isMarker(index, 4) && (star1 = index);

    index > 13 && !star2 && isMarker(index, 14) && (star2 = index);
  }

  showTheResult({ star1, star2, path: __filename });
})();
