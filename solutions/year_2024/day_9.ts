import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getStar1 = (input: string) => {
  const arr: string[] = [];

  for (let i = 0, page = 0; i < input.length; i++) {
    let positions = +input[i];

    if (positions === 0) continue;
    const isPage = i % 2 === 0;
    const char = isPage ? String(page++) : '.';

    while (positions--) arr.push(char);
  }

  console.log(arr.join(' '));

  let star1 = 0;

  for (let start = 0, end = arr.length - 1; start <= end; start++) {
    if (isNaN(+arr[start])) {
      while (isNaN(+arr[end])) --end;

      arr[start] = arr[end--];
    }

    if (start > end) break;

    star1 += +arr[start] * start;
  }

  return star1;
};

const getStar2 = (input: string) => {
  const mapArr: { char: string; positions: number }[] = [];

  for (let i = 0, page = 0; i < input.length; i++) {
    let positions = +input[i];

    if (positions === 0) continue;

    const isPage = i % 2 === 0;
    const char = isPage ? String(page++) : '.';

    mapArr.push({ char, positions });
  }

  const arr: string[] = [];

  return mapArr;
};

(async () => {
  console.time('time');
  const input = '2333133121414131402';
  const inputc = (await getInputForDay(__filename))
    .trim()
    .split('\n')[0]
    .trim();

  const star1 = getStar1(input);
  const star2 = getStar2(input);

  showTheResult({ star1, star2: 'wip', path: __filename });
  console.timeEnd('time');
})();
