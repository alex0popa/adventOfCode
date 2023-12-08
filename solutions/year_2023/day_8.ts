
import { extractLetterGroups, getLcm } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const instructions = (input.shift() ?? '')
    .split('')
    .map(char => char === 'L' ? 0 : 1);

  const network = input
    .slice(1)
    .reduce<{ [key: string]: string[] }>((map, line) => {
      const [key, ...value] = extractLetterGroups(line);

      return { ...map, [key]: value }
    },
    {}
  );

  const getSteps = (position: string) => {
    let steps = 0;

    while (position[2] !== 'Z') {
      const lr = instructions[steps++ % instructions.length];
      position = network[position][lr];
    }
  
    return steps;
  }

  const star1 = getSteps('AAA');

  const aList = Object
    .keys(network)
    .reduce<string[]>((arr, key) => key[2] === 'A' ? [...arr, key] : arr,[]);

  const star2Steps = aList.reduce<number[]>(
    (steps, key) => [...steps, getSteps(key)],
    []
  );

  const star2 = getLcm(star2Steps);

  showTheResult({ star1, star2, path: __filename });
})();