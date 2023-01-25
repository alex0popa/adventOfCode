import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Point = { row: number; col: number };

(async () => {
  const input =
    // '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>';
    (await getInputForDay(__filename)).trim();

  const floor = Array<number>(7).fill(0);
  const shapes = [
    ['####'],
    ['.#.', '###', '.#.'],
    ['..#', '..#', '###'],
    ['#', '#', '#', '#'],
    ['##', '##'],
  ];

  const getCoordinates = (shape: string[], high: number) => {
    const coordinates: Point[] = [];

    for (let i = 0; i < shape[0].length; ++i) {
      shape.forEach((line, j) => {
        line[i] === '#' && coordinates.push({ col: i + 2, row: high - j });
      });
    }

    return coordinates;
  };

  const push = (coordinates: Point[], dir: '<' | '>') => {
    if (
      dir === '>' &&
      coordinates.every(
        ({ row, col }) => col < floor.length - 1 && floor[col + 1] < row
      )
    ) {
      for (let i = 0; i < coordinates.length; i++) {
        ++coordinates[i].col;
      }
    }

    if (
      dir === '<' &&
      coordinates.every(({ row, col }) => col > 0 && floor[col - 1] < row)
    ) {
      for (let i = 0; i < coordinates.length; i++) {
        --coordinates[i].col;
      }
    }
  };

  const fall = (coordinates: Point[]) => {
    for (let i = 0; i < coordinates.length; i++) {
      --coordinates[i].row;
    }
  };

  const canFall = (coordinates: Point[], can = true) => {
    coordinates.forEach(({ col, row }) => {
      if (can && floor[col] === row - 1) {
        can = false;
      }
    });

    return can;
  };

  for (let count = 0, i = 0; count < 2022; ++count) {
    const shape = shapes[count % shapes.length];
    const highestCoord = Math.max(...floor) + 3 + shape.length;
    const coordinates = getCoordinates(shape, highestCoord);

    i === input.length && (i = 0);

    push(coordinates, input[i++] as '<' | '>');

    // can fall
    while (canFall(coordinates)) {
      fall(coordinates);

      i === input.length && (i = 0);

      push(coordinates, input[i++] as '<' | '>');
    }

    coordinates.forEach(({ row, col }) => {
      floor[col] = Math.max(floor[col], row);
    });
  }

  const star1 = Math.max(...floor);

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();
