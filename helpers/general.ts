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
