import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const [factorA, factorB, modulo] = [16807, 48271, 2147483647];

const hexToBitsUsingParseInt = (hex: string): string => {
  return (
    [...hex.toLowerCase()]
      // Convert hex to binary and pad to 4 bits
      .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
      .join('')
  );
};

const isConsideredByJudge = (a: number, b: number): boolean => {
  const keyA = hexToBitsUsingParseInt(a.toString(16)).slice(-16);
  const keyB = hexToBitsUsingParseInt(b.toString(16)).slice(-16);

  return keyA === keyB;
};

const getStar1 = (input: number[]) => {
  let [generatorA, generatorB] = [...input];
  let star1 = 0;

  for (let i = 0; i < 40000000; i++) {
    generatorA = (generatorA * factorA) % modulo;
    generatorB = (generatorB * factorB) % modulo;

    if (isConsideredByJudge(generatorA, generatorB)) star1++;
  }

  return star1;
};

const getStar2 = (input: number[]) => {
  let [generatorA, generatorB] = [...input];
  let star2 = 0;

  for (let i = 0; i < 5000000; i++) {
    generatorA = (generatorA * factorA) % modulo;
    generatorB = (generatorB * factorB) % modulo;

    while (generatorA % 4) generatorA = (generatorA * factorA) % modulo;
    while (generatorB % 8) generatorB = (generatorB * factorB) % modulo;

    if (isConsideredByJudge(generatorA, generatorB)) star2++;
  }

  return star2;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers)
    .flat();

  const star1 = getStar1(input);
  const star2 = getStar2(input);

  showTheResult({ star1, star2, path: __filename });
  console.timeEnd('time');
})();
