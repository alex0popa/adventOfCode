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
