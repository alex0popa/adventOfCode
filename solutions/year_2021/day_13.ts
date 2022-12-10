import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const day13 = async () => {
  const input = (await getInputForDay(__filename)).split('\n\n');

  const coordinates = input[0]
    .split('\n')
    .map((e) => e.split(',').map((el) => +el));
  const instructions = input[1].split('\n').map((line) => line.slice(11));

  const lines = Math.max(...coordinates.map((e) => +e[0])) + 1;
  const columns = Math.max(...coordinates.map((e) => +e[1])) + 1;

  let map: string[][] = [...Array(lines)].map(() => Array(columns).fill(' '));
  coordinates.forEach(([x, y]) => (map[x][y] = '#'));

  const foldX = (x: number) => {
    for (
      let up = x - 1, down = x + 1;
      up >= 0 && down < map.length;
      --up, ++down
    ) {
      for (let col = 0; col < map[0].length; ++col) {
        map[down][col] === '#' && (map[up][col] = '#');
      }
    }

    map = map.slice(0, x);
  };

  const foldY = (y: number) => {
    for (let l = y - 1, r = y + 1; l >= 0 && r < map[0].length; --l, ++r) {
      for (let row = 0; row < map.length; ++row) {
        map[row][r] === '#' && (map[row][l] = '#');
      }
    }

    map = map.map((row) => row.slice(0, y));
  };

  const firstInstruction = +instructions[0].slice(2);
  foldX(firstInstruction);

  const star1 = map.flat().reduce((a, c) => (c === '#' ? a + 1 : a), 0);

  instructions.slice(1).forEach((instruction) => {
    const value = +instruction.slice(2);

    instruction[0] === 'x' ? foldX(value) : foldY(value);
  });

  for (let j = 0; j < map[0].length; ++j) {
    let s = '';
    for (let i = 0; i < map.length; ++i) {
      s += map[i][j];
    }
    console.log(s);
  }

  const star2 = 'UEFZCUCJ';

  showTheResult({ star1, star2, path: __filename });
};

day13();
