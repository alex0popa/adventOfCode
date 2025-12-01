import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { Point } from '../../helpers/typescript';

const getAntinodePoints = (point1: Point, point2: Point, step = 1) => {
  const deltaRow = (point1.row - point2.row) * step;
  const deltaCol = (point1.col - point2.col) * step;
  return {
    antinodePoint1: { row: point1.row + deltaRow, col: point1.col + deltaCol },
    antinodePoint2: {
      row: point2.row - deltaRow,
      col: point2.col - deltaCol,
    },
  };
};

const solve = (antenas: Point[][], input: string[], steps = Infinity) => {
  const matrix = [...input].map((line) => line.split(''));
  let antinodes = new Set<string>();

  for (const points of antenas) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (steps > 1) {
          antinodes.add(`${points[i].row},${points[i].col}`);
          antinodes.add(`${points[j].row},${points[j].col}`);
        }

        for (let step = 1; step <= steps; step++) {
          const { antinodePoint1, antinodePoint2 } = getAntinodePoints(
            points[i],
            points[j],
            step,
          );

          if (matrix[antinodePoint1.row]?.[antinodePoint1.col]) {
            antinodes.add(`${antinodePoint1.row},${antinodePoint1.col}`);
          }

          if (matrix[antinodePoint2.row]?.[antinodePoint2.col]) {
            antinodes.add(`${antinodePoint2.row},${antinodePoint2.col}`);
          }

          if (
            !matrix[antinodePoint1.row]?.[antinodePoint1.col] &&
            !matrix[antinodePoint2.row]?.[antinodePoint2.col]
          ) {
            break;
          }
        }
      }
    }
  }

  return antinodes.size;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const matrix = [...input].map((line) => line.split(''));

  const map: { [key: string]: Point[] } = {};

  for (let row = 0; row < matrix.length; row++) {
    const line = matrix[row];

    for (let col = 0; col < line.length; col++) {
      const char = line[col];

      if (char !== '.') {
        if (!map[char]) {
          map[char] = [];
        }

        map[char].push({ col, row });
      }
    }
  }

  const antenas = Object.values(map);
  const star1 = solve(antenas, input, 1);
  const star2 = solve(antenas, input);

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
