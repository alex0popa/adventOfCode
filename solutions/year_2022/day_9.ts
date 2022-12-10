import { directionsVector } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const DIRECTIONS = ['U', 'R', 'D', 'L'] as const;

type Dirs = typeof DIRECTIONS[number];

const directions = DIRECTIONS.reduce<{ [K in Dirs]?: number[] }>(
  (obj, key, i) => ({ ...obj, [key]: directionsVector[i] }),
  {}
);

class Knot {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Only head */
  move(direction: Dirs, [x, y] = directions[direction]!) {
    this.x += x;
    this.y += y;
  }

  /** Not head */
  follow(targetKnot: Knot) {
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

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const knots = [...Array(10)].map(() => new Knot(0, 0));
  const tail1 = knots.at(1);
  const tail2 = knots.at(-1);
  const visited1 = new Set<string>();
  const visited2 = new Set<string>();

  const markAll = () => {
    tail1 && markVisited(tail1.x, tail1.y, visited1);
    tail2 && markVisited(tail2.x, tail2.y, visited2);
  };

  input.forEach((line) => {
    const [direction, moves] = line.split(' ') as [Dirs, string];

    for (let availableMoves = +moves; availableMoves--; markAll()) {
      knots.forEach((knot, i) => {
        const isHead = i === 0;

        isHead ? knot.move(direction) : knot.follow(knots[i - 1]);
      });
    }
  });

  const star1 = visited1.size;
  const star2 = visited2.size;

  showTheResult({ star1, star2, path: __filename });
})();
