import { visitDirections } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { knotHash } from './day_10';

const hexToBitsUsingParseInt = (hex: string): string => {
  return (
    [...hex.toLowerCase()]
      // Convert hex to binary and pad to 4 bits
      .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
      .join('')
  );
};

const markRegion = (grid: string[][], queue: [number, number][]) => {
  while (queue.length > 0) {
    const coordinates = queue.shift();

    if (!coordinates) continue;

    const [x, y] = coordinates;

    visitDirections(x, y, (newX, newY) => {
      if (grid[newX]?.[newY] === '1') {
        queue.push([newX, newY]);
        grid[newX][newY] = '0';
      }
    });
  }
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n')[0];
  const grid: string[][] = [];

  for (let i = 0; i < 128; i++) {
    const lengths = [...(input + `-${i}`)].map((c) => c.charCodeAt(0));
    const bits = hexToBitsUsingParseInt(knotHash(lengths)).split('');

    grid.push(bits);
  }

  const star1 = grid.flat().filter((bit) => bit === '1').length;
  let star2 = 0;

  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 128; j++) {
      if (grid[i][j] === '1') {
        markRegion(grid, [[i, j]]);
        ++star2;
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();

//  8140, 8228 low
