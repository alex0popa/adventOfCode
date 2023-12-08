export const isCapital = (char: string) => /[A-Z]/.test(char);

/** Can get uppercase or lowercase alphabet as array */
export const getAlphabet = (a: 'A' | 'a', A = a.charCodeAt(0)) =>
  [...Array(26)].map(() => String.fromCharCode(A++));

/** Get all path of a tree from start node to end node */
export const getRoutes = (
  routes: { [key: string]: string[] },
  start: string,
  end: string,
  visitedCondition = (param: string) => true
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

/** up right down left */
export const directionsVector = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;

export const extractNumbers = (str: string) =>
  (str.match(/-?\d+/g) ?? []).map(Number);

export const extractLetterGroups = (inputString: string): string[] => {
  const letterGroups = inputString.match(/[a-zA-Z]+/g);

  return letterGroups ? letterGroups : [];
};

// greatest common divisor (GCD)
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
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
 *
 * Ex: day 11 2022
 */
export const getLcm = (numbers: number[]): number => {
  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    result = (result * numbers[i]) / gcd(result, numbers[i]);
  }
  
  return result;
}
