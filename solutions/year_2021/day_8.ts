import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getSimples = (s: string) =>
  s.split(' ').reduce((x, y) => ([2, 3, 4, 7].includes(y.length) ? ++x : x), 0);

const day8 = async () => {
  const input = (await getInputForDay(__filename)).split('\n');

  const star1 = input
    .map((line) =>
      line
        .split(' | ')[1]
        .split(' ')
        .map((el) =>
          el
            .split('')
            .sort((a, b) => a.localeCompare(b))
            .join('')
        )
        .join(' ')
    )
    .reduce((a, c) => a + getSimples(c), 0);

  const star2 = input.reduce((a, line) => {
    const [inp, out] = line.split(' | ');

    let one = '',
      four = '';

    inp.split(' ').forEach((el) => {
      el.length === 2 && (one = el);
      el.length === 4 && (four = el);
    });

    let res = out.split(' ');

    res.forEach((s, i) => {
      if (s.length === 2) {
        res[i] = '1';
      } else if (s.length === 3) {
        res[i] = '7';
      } else if (s.length === 4) {
        res[i] = '4';
      } else if (s.length === 7) {
        res[i] = '8';
      } else if (s.length === 5) {
        if (
          s.split('').reduce((a, c) => (one.includes(c) ? ++a : a), 0) === 2
        ) {
          res[i] = '3';
        } else if (
          s.split('').reduce((a, c) => (four.includes(c) ? ++a : a), 0) === 2
        ) {
          res[i] = '2';
        } else {
          res[i] = '5';
        }
      } else if (s.length === 6) {
        if (
          s.split('').reduce((a, c) => (four.includes(c) ? ++a : a), 0) === 4
        ) {
          res[i] = '9';
        } else if (
          s.split('').reduce((a, c) => (one.includes(c) ? ++a : a), 0) === 2
        ) {
          res[i] = '0';
        } else {
          res[i] = '6';
        }
      }
    });

    return a + +res.join('');
  }, 0);

  showTheResult({ star1, star2, path: __filename });
};

day8();
