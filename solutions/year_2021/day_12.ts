import { getRoutes, isCapital } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename))
    .split('\n')
    .map((line) => line.split('-'));

  const routes = input.reduce<{ [key: string]: string[] }>(
    (obj, [el1, el2]) => {
      el2 !== 'start' && (obj[el1] ? obj[el1].push(el2) : (obj[el1] = [el2]));

      el1 !== 'start' && (obj[el2] ? obj[el2].push(el1) : (obj[el2] = [el1]));

      return obj;
    },
    {}
  );

  const checkNode = (str: string) => !isCapital(str);

  const allPaths = getRoutes(routes, 'start', 'end', checkNode);

  const star1 = allPaths.length;

  // console.log({ allPaths });

  showTheResult({ star1, star2: 0, path: __filename });
})();
