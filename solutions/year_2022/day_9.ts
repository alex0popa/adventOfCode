import { directionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const DIRECTIONS = ['U', 'R', 'D', 'L'] as const;

type Dirs = typeof DIRECTIONS[number];

const directions = DIRECTIONS.reduce<{ [K in Dirs]?: number[] }>(
  (obj, key, i) => ({ ...obj, [key]: directionsVector[i] }),
  {}
);

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Only head */
  move(direction: Dirs) {
    const [x, y] = directions[direction]!;

    this.x += x;
    this.y += y;
  }

  /** Not head */
  follow(targetKnot: Point) {
    /** Distance from this knot to target knot */
    const distance = Math.max(
      Math.abs(this.x - targetKnot.x),
      Math.abs(this.y - targetKnot.y)
    );

    const canMoveThisKnot = distance > 1;

    // Move this point
    if (canMoveThisKnot) {
      // coordinates
      const directionX = targetKnot.x - this.x;
      const directionY = targetKnot.y - this.y;

      /**
       * directionX - directionY:
       *  0 => do nothing
       *  1 or 2 => this.x++
       *  -1 or -2 => this.x--
       */
      this.x += Math.abs(directionX) === 2 ? directionX / 2 : directionX;
      this.y += Math.abs(directionY) === 2 ? directionY / 2 : directionY;
    }
  }
}

const markVisited = (x: number, y: number, set: Set<string>) =>
  set.add(`${x}-${y}`);

const getStar = (input: string[], numberOfKnots: number) => {
  const knots = new Array(numberOfKnots).fill(0).map((_) => new Point(0, 0));
  const tail = knots.slice(-1)[0];
  const visited = new Set<string>();

  markVisited(0, 0, visited);

  input.forEach((line) => {
    let [direction, moves] = line.split(' ') as [Dirs, string | number];
    moves = +moves;

    while (moves--) {
      knots.forEach((knot, i) => {
        const isHead = i === 0;

        isHead ? knot.move(direction) : knot.follow(knots[i - 1]);
      });

      markVisited(tail.x, tail.y, visited);
    }
  });

  return visited.size;
};

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const star1 = getStar(input, 2);
  const star2 = getStar(input, 10);

  showTheResult({ star1, star2, path: __filename });
})();
