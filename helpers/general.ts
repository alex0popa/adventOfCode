export const isCapital = (char: string) => /[A-Z]/.test(char);

/** Can get uppercase or lowercase alphabet as array */
export const getAlphabet = (a: 'A' | 'a', A = a.charCodeAt(0)) =>
  [...Array(26)].map(() => String.fromCharCode(A++));

/** Get all path of a tree from start node to end node */
export const getRoutes = (
  routes: { [key: string]: string[] },
  start: string,
  end: string,
  visitedCondition = (param: string) => true,
) => {
  const stack: [string, string[]][] = [[start, []]];
  const result: string[][] = [];

  while (stack.length) {
    const [node, visited] = stack.shift()!;

    visitedCondition(node) && visited.push(node);

    node === end
      ? result.push(visited)
      : routes[node].forEach((n) => {
          !visited.includes(n) && stack.push([n, [...visited]]);
        });
  }

  return result;
};

export const containsNumbers = (str: string) => /\d/.test(str);

export const directionsVectorMap = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
} as const;

/** up right down left */
export const directionsVector = Object.values(directionsVectorMap);

/** Visit all adjacent positions from a given point */
export const visitDirections = <T>(
  row: number,
  col: number,
  callback: (newRow: number, newCol: number) => T,
): T[] => {
  return directionsVector.map(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    return callback(newRow, newCol);
  });
};

export const aroundDirectionsVector = [
  [-1, 0], // N
  [-1, 1], // NE
  [0, 1], // E
  [1, 1], // SE
  [1, 0], // S
  [1, -1], // SW
  [0, -1], // W
  [-1, -1], // NW
] as const;

export const visitAround = <T>(
  row: number,
  col: number,
  callback: (newRow: number, newCol: number) => T,
): T[] => {
  return aroundDirectionsVector.map(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    return callback(newRow, newCol);
  });
};

export const extractNumbers = (str: string) => {
  return (str.match(/-?\d+/g) ?? []).map(Number);
};

export const extractLetterGroups = (inputString: string): string[] => {
  return inputString.match(/[a-zA-Z]+/g) ?? [];
};

// greatest common divisor (GCD)
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * Performing operations (+, *) on normal numbers, the values ​​will reach extremely
 * high values ​​that cannot be held in a variable of type int or bigint, so the
 * solution is to use Least Common Multiple - lcm.
 *
 * Want to know for each item if it is divisible by X, Y,.. (ex: 23, 19, 13, 17)
 * If wanna know if it's divisible by 23, just need to keep track of the number modulo 23.
 * x + a is divisible by 23 if (x % 23) + a is divisible by 23
 * x * a is divisible by 23 if (x % 23) * a is divisible by 23
 * Can keep track of the number modulo lcm (ex: 23 * 19 * 13 * 17);
 */
export const getLcm = (numbers: number[]): number => {
  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    result = (result * numbers[i]) / gcd(result, numbers[i]);
  }

  return result;
};

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b);

/**
 * Generates all permutations of the input array.
 * Each permutation contains all numbers in the array exactly once.
 * @param arr - The input array of numbers.
 * @returns An array containing all permutations of the input array.
 */
export const generatePermutations = (arr: number[]): number[][] => {
  const result: number[][] = [];

  const permute = (current: number[], remaining: number[]) => {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const next = remaining[i];
      const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
      permute([...current, next], newRemaining);
    }
  };

  permute([], arr);
  return result;
};
