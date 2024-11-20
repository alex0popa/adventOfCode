import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type CubeCoordinates = { x: number; y: number; z: number };
type HexDirections = 'n' | 's' | 'ne' | 'nw' | 'se' | 'sw';
type MoveValue = -1 | 0 | 1;
type HexMove = [MoveValue, MoveValue, MoveValue];

const hexDistance = (a: CubeCoordinates, b: CubeCoordinates): number => {
  return Math.max(
    Math.abs(a.x - b.x),
    Math.abs(a.y - b.y),
    Math.abs(a.z - b.z),
  );
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')[0]
    .split(',') as HexDirections[];

  const moves: { [key in HexDirections]: HexMove } = {
    n: [1, 0, -1], // "up."
    s: [-1, 0, 1], // "down."
    ne: [1, -1, 0], // "up-right."
    nw: [0, 1, -1], // "up-left."
    se: [0, -1, 1], // "down-right."
    sw: [-1, 1, 0], // "down-left."
  };

  let [x, y, z] = [0, 0, 0];
  let maxDistance = 0;

  for (const direction of input) {
    const [dx, dy, dz] = moves[direction];

    x += dx;
    y += dy;
    z += dz;

    const actualDistance = hexDistance({ x, y, z }, { x: 0, y: 0, z: 0 });

    maxDistance = Math.max(maxDistance, actualDistance);
  }

  const star1 = hexDistance({ x, y, z }, { x: 0, y: 0, z: 0 });

  showTheResult({ star1, star2: maxDistance, path: __filename });
  console.timeEnd('time');
})();
