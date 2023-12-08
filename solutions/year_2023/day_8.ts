import { extractLetterGroups, getLcm } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const instructions = input[0]
    .split('')
    .map(char => char === 'L' ? 0 : 1);

  const network = input
    .slice(2)
    .reduce<{ [node: string]: [string, string] }>((map, line) => {
      const [node, ...nodes] = extractLetterGroups(line);

      return { ...map, [node]: [nodes[0], nodes[1]] }
    },
    {}
  );

  const getSteps = (node: string, steps = 0) => {
    while (node[2] !== 'Z') {
      const instruction = instructions[steps++ % instructions.length];
      node = network[node][instruction];
    }
  
    return steps;
  }

  const star1 = getSteps('AAA');

  const nodesEndsWithA = Object
    .keys(network)
    .reduce<string[]>((arr, node) => node[2] === 'A' ? [...arr, node] : arr,[]);

  const star2Steps = nodesEndsWithA.reduce<number[]>(
    (steps, node) => [...steps, getSteps(node)],
    []
  );

  const star2 = getLcm(star2Steps);

  showTheResult({ star1, star2, path: __filename });
})();