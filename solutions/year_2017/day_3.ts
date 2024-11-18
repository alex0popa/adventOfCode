import { directionsVector, visitAround } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getStar1 = (value: number) => {
  const approximateSizeSquare = Math.floor(Math.sqrt(value) + 2);
  const radius = (approximateSizeSquare - 1) / 2;
  const distanceFromMiddle = value % radius;

  return radius + distanceFromMiddle - 1;
};

const getStar2 = (targetValue: number) => {
  const matrix = [...Array(100)].map(() => [...Array(100)].map(() => 0));
  let [xRow, yCol, layer, maxValue] = [50, 50, 1, 0];
  matrix[xRow][yCol] = 1;

  const setValueOnMatrix = () => {
    const value = visitAround(
      xRow,
      yCol,
      (row, col) => matrix[row][col],
    ).reduce((a, b) => a + b);

    matrix[xRow][yCol] = value;

    if (value > targetValue && !maxValue) maxValue = value;
  };

  while (!maxValue) {
    ++yCol;
    setValueOnMatrix();

    // North
    for (let i = layer; i > 0; --i) {
      --xRow;
      setValueOnMatrix();
    }

    // WEST
    for (let i = layer + 1; i > 0; --i) {
      --yCol;
      setValueOnMatrix();
    }

    // SOUTH
    for (let i = layer + 1; i > 0; --i) {
      ++xRow;
      setValueOnMatrix();
    }

    // EST
    for (let i = layer + 1; i > 0; --i) {
      ++yCol;
      setValueOnMatrix();
    }

    layer += 2;
  }

  return maxValue;
};

// For part 2, we can use a more compact spiral generation
const getStar2Compact = (targetValue: number) => {
  const values = new Map([['0,0', 1]]); // Fix: Use string key '0,0' instead of [0,0]

  let x = 0,
    y = 0,
    dirIndex = 0;
  let currentValue = 1;
  let stepsInDirection = 1;
  let stepsTaken = 0;

  while (currentValue <= targetValue) {
    // Move to next position
    x += directionsVector[dirIndex][0];
    y += directionsVector[dirIndex][1];

    // Calculate new value
    currentValue = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${x + dx},${y + dy}`;
        currentValue += values.get(key) || 0;
      }
    }

    values.set(`${x},${y}`, currentValue);

    // Handle direction changes
    stepsTaken++;
    if (stepsTaken === stepsInDirection) {
      stepsTaken = 0;
      dirIndex = (dirIndex + 1) % 4;
      if (dirIndex % 2 === 0) {
        stepsInDirection++;
      }
    }
  }

  return currentValue;
};

(async () => {
  console.time('time');
  const input = +(await getInputForDay(__filename)).trim().split('\n')[0];

  showTheResult({
    star1: getStar1(input),
    star2: getStar2Compact(input),
    path: __filename,
  });
  console.timeEnd('time');
})();
