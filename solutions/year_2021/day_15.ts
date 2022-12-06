import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

export const findCost = (riskLevel: number[], rowLength: number) => {
  const goal = riskLevel.length - 1;

  const queue = [0];
  const cost: Record<number, number> = { 0: 0 };

  const neighbors = (index: number) => {
    const i = Math.floor(index / rowLength);
    const j = index % rowLength;
    return [
      j > 0 ? i * rowLength + j - 1 : 0,
      j + 1 < rowLength ? i * rowLength + j + 1 : 0,
      i > 0 ? (i - 1) * rowLength + j : 0,
      i + 1 < riskLevel.length / rowLength ? (i + 1) * rowLength + j : 0,
    ].filter(Boolean);
  };

  while (queue.length > 0) {
    const current = queue.sort((a, b) => cost[b] - cost[a]).pop()!;

    if (current === goal) {
      break;
    }

    for (const next of neighbors(current)) {
      const newCost = (cost[current] || 0) + riskLevel[next];
      if (!(next in cost) || newCost < cost[next]) {
        cost[next] = newCost;
        queue.push(next);
      }
    }
  }

  return cost[goal];
};
const day15 = async () => {
  const input = (await getInputForDay(__filename))
    .split('\n')
    .map((l) => l.split('').map((e) => +e));

  // export const parse = (input: string): [number[], number] => {
  //   const rows = input.trim().split('\n')
  //   return [rows.flatMap((s) => Array.from(s).map(Number)), rows.length]
  // }

  // export const first = (input: string) => {
  //   const [riskLevel, rowLength] = parse(input)
  //   return findCost(riskLevel, rowLength)
  // }

  // const tile = (input: string) => {
  //   const tiles = input
  //     .trim()
  //     .split('\n')
  //     .map((s) => Array.from(s).map(Number))

  //   let result = ''
  //   for (let i = 0; i < 5 * tiles.length; i++) {
  //     for (let j = 0; j < 5 * tiles[0].length; j++) {
  //       const row = i % tiles.length
  //       const column = j % tiles[0].length
  //       const offset =
  //         Math.floor(i / tiles.length) + Math.floor(j / tiles[0].length)
  //       const number = tiles[row][column] + offset
  //       result += ((number % 10) + Math.floor(number / 10)).toString()
  //     }
  //     result += '\n'
  //   }
  //   return result.trim()
  // }

  // export const second = (input: string) => {
  // const [riskLevel, rowLength] = parse(tile(input))
  // console.log(findCost(riskLevel, rowLength))
  // }

  const findMinimumCostPath = (cost: number[][], M: number, N: number) => {
    //declare the minCost matrix
    const minCost = [...Array(M)].map(() => Array(N).fill(0));

    minCost[0][0] = cost[0][0];

    // initialize first row of minCost matrix
    for (let col = 1; col < N; ++col) {
      minCost[0][col] = minCost[0][col - 1] + cost[0][col];
    }

    // initialize first col of minCost matrix
    for (let row = 1; row < M; ++row) {
      minCost[row][0] = minCost[row - 1][0] + cost[row][0];
    }

    // complete minCost matrix
    for (let i = 1; i < M; ++i) {
      for (let j = 1; j < N; ++j) {
        const down = minCost[i - 1][j];
        const right = minCost[i][j - 1];

        minCost[i][j] = Math.min(down, right) + cost[i][j];
      }
    }

    return minCost[M - 1][N - 1];
  };

  // the starting position is never entered, so its risk is not counted -> input[0][0]
  const star1 =
    findMinimumCostPath(input, input.length, input[0].length) - input[0][0];

  const inputX5: number[][] = [];
  for (let i = 0; i < 5; ++i) {
    input.forEach((l) => {
      const line: number[] = [];

      for (let j = 0; j < 5; ++j) {
        l.forEach((n) => line.push(n + i + j > 9 ? n + i + j - 9 : n + i + j));
      }

      inputX5.push(line);
    });
  }

  // inputX5.forEach(l => console.log(l.join('')))

  const star2 = findCost(inputX5.flat(), 500);
  //findMinimumCostPath(inputX5, inputX5.length, inputX5[0].length) - inputX5[0][0];

  console.log('FIX ALGORITHM');

  showTheResult({ star1, star2, path: __filename });
};

day15();
