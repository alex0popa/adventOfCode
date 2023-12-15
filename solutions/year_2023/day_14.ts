import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const CYCLES = 1_000_000_000;

function getStar1(matrix: string[][]) {
  let star = 0;

  for (let col = 0; col < matrix[0].length; ++col) {
    let roundedRocks = 0;

    for (let row = matrix.length - 1; row >= 0; --row) {
      if(matrix[row][col] === 'O') roundedRocks++;
      
      if (matrix[row][col] === '#' || row === 0) {
  
        while(roundedRocks) {
          const value = (matrix.length - row - roundedRocks) + 
            (row === 0 && matrix[row][col] !== '#' ? 1 : 0);
          star += value;
          --roundedRocks;
        }
      }
    }
  }

  return star;
}

function getStar2(matrix: string[][]) {
  let star = 0;

  for (let row = 0; row < matrix.length; ++row) {
    for (let col = 0; col < matrix[row].length; ++col) {
      if(matrix[row][col] === 'O') {
        star += (matrix.length - row);
      }
    }
  }

  return star;
}

(async () =>  {
console.time('time');

const input = (await getInputForDay(__filename))
  .trim()
  .split('\n')
  .map(line => line.split(''));

const star1 = getStar1(input);

const matrix = spin(input, CYCLES);
const star2 = getStar2(matrix);

showTheResult({ star1, star2, path: __filename });
})();

function getMatrixAsKey(matrix: string[][]) {

  return matrix.map(line => line.join('')).join('');
}

function spinToNorth(matrix: string[][]) {
  for (let col = 0; col < matrix[0].length; ++col) {
    let startRow = -1;
    let roundedRocks = 0;

    for (let row = 0; row < matrix.length; ++row) {
      if (matrix[row][col] === 'O') {
        matrix[row][col] = '.';
        ++roundedRocks;
      }

      if(matrix[row][col] === '#' || row === matrix.length - 1) {
        while(roundedRocks) {
          matrix[startRow + roundedRocks][col] = 'O';

          --roundedRocks;
        }

        startRow = row;
      }
    }
  }
}

function spinToWest(matrix: string[][]) {
  for (let row = 0; row < matrix.length; ++row) {
    let roundedRocks = 0;

    for (let col = matrix[row].length - 1; col >= 0 ; --col) {
      if (matrix[row][col] === 'O') {
        matrix[row][col] = '.';
        ++roundedRocks;
      }

      if(matrix[row][col] === '#' || col === 0) {
        while(roundedRocks) {
          matrix[row][col + roundedRocks - (col === 0 && matrix[row][col] !== '#' ? 1 : 0)] = 'O';

          --roundedRocks;
        }
      }
    }
  }
}

function spinToSouth(matrix: string[][]) {
  for (let col = 0; col < matrix[0].length; ++col) {
    let roundedRocks = 0;

    for (let row = 0; row < matrix.length; ++row) {
      if (matrix[row][col] === 'O') {
        ++roundedRocks;
        matrix[row][col] = '.';
      }

      if(matrix[row][col] === '#' || row === matrix.length - 1) {
        while(roundedRocks) {
          matrix[row - roundedRocks + (row === matrix.length - 1 && matrix[row][col] !== '#' ? 1 : 0)][col] = 'O';

          --roundedRocks;
        }
      }
    }
  }
}

function spinToEast(matrix: string[][]) {
  for (let row = 0; row < matrix.length; ++row) {
    let roundedRocks = 0;

    for (let col = 0; col < matrix[row].length; ++col) {
      if (matrix[row][col] === 'O') {
        ++roundedRocks;
        matrix[row][col] = '.';
      }

      if(matrix[row][col] === '#' || col === matrix[row].length - 1) {
        while(roundedRocks) {
          matrix[row][col - roundedRocks + (col === matrix[row].length - 1 && matrix[row][col] !== '#' ? 1 : 0)] = 'O';

          --roundedRocks;
        }
      }
    }
  }
}

function extractMatrixFromString(string: string, rowLength: number) {
  const matrix: string[][] = [];
  let tempArr: string[] = [];

  for (let i = 0; i < string.length; i++) {
    tempArr.push(string[i]);
    
    if(tempArr.length === rowLength) {
      matrix.push(tempArr);
      tempArr = []
    }
  }

  return matrix;
}

function runCompleteCycle(input: string[][]) {
  spinToNorth(input);
  spinToWest(input);
  spinToSouth(input);
  spinToEast(input);
}

function spin(input: string[][], cycles: number) {
  let cacheKey = getMatrixAsKey(input);
  const cache: { [key: string]: number } = { [cacheKey]: 1 };

  while (Object.values(cache).every(value => value === 1)) {
    runCompleteCycle(input);

    cacheKey = getMatrixAsKey(input);

    cache[cacheKey] = (cache[cacheKey] ?? 0) + 1;

    --cycles;
  }
  
  const cachedValues = Object.values(cache);
  const firstDuplicatedIndex = cachedValues.findIndex(value => value > 1) ?? 0;
  const cacheValueIdx = firstDuplicatedIndex + cycles % (cachedValues.length - firstDuplicatedIndex);
  const [matrixAsKey] = Object.entries(cache)[cacheValueIdx];

  return extractMatrixFromString(matrixAsKey, input[0].length);
}
