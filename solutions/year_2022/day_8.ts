import { constants } from 'crypto';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

/** [left, rigth, top, bottom] */
const coordinates = [0, 1, 2, 3] as const;
type Coordinate = typeof coordinates[number];

(async () => {
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number));

  /** MaxLength */
  const ML = input.length;
  const tallests = new Set<string>();
  let highestScenicScore = 0;

  const getHeightAndAddTallest = (tree: number, i: number, j: number) =>
    input[i][j] > tree && tallests.add(i + '-' + j) ? input[i][j] : tree;

  const handleHighestScenicScore = (row: number, col: number) => {
    const tree = input[row][col];

    /** [left, rigth, top, bottom] */
    const measure = [0, 0, 0, 0];

    /** [left, rigth, top, bottom] */
    const dirs = [col - 1, col + 1, row - 1, row + 1];

    /** [left, rigth, top, bottom] */
    const search = [true, true, true, true];

    /**  Get the coordinates and move on next position -- / ++ */
    const getCoordinates = (idx: Coordinate) =>
      idx === 0
        ? [row, dirs[idx]--] // move -> left
        : idx === 1
        ? [row, dirs[idx]++] // move -> rigth
        : idx === 2
        ? [col, dirs[idx]--] // move -> top
        : [col, dirs[idx]++]; // move -> bottom

    const isOnGrid = (i: number) => i >= 0 && i < ML;

    /** Searches for all directions 0-left, 1-rigth, 2-top, 3-bottom */
    const handleSearch = (i: Coordinate) => {
      const [a, b] = getCoordinates(i);

      search[i] &&= ++measure[i] > 0 && tree > input[a][b] && isOnGrid(dirs[i]);
    };

    while (search.some(Boolean)) coordinates.forEach(handleSearch);

    const scenicScore = measure.reduce((prod, value) => prod * value);

    highestScenicScore = Math.max(scenicScore, highestScenicScore);
  };

  for (let i = 1; i < ML - 1; ++i) {
    let left = input[i][0];
    let right = input[i][ML - 1];
    let top = input[0][i];
    let bottom = input[ML - 1][i];

    for (let j = 1; j < ML - 1; ++j) {
      // left -> right
      left = getHeightAndAddTallest(left, i, j);

      // top -> bottom
      top = getHeightAndAddTallest(top, j, i);

      // right -> left
      right = getHeightAndAddTallest(right, i, ML - j - 1);

      // bottom -> top
      bottom = getHeightAndAddTallest(bottom, ML - j - 1, i);

      handleHighestScenicScore(i, j);
    }
  }

  const visibleTrees = tallests.size + (input[0].length - 1) * 4;

  showTheResult({
    star1: visibleTrees,
    star2: highestScenicScore,
    path: __filename,
  });
})();
