import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const day14 = async () => {
  const input = (await getInputForDay(__filename)).split('\n\n');

  const rules = Object.fromEntries(
    input[1].split('\n').map((s) => s.split(' -> '))
  );
  const polymer = input[0];

  type Obj = { [key: string]: number };

  // Initialization of the frequency of the polymer pairs
  let dictionaryFreq = polymer
    .split('')
    .slice(0, -1)
    .reduce((dict, char, i) => {
      const key = char + polymer[i + 1];
      const value = (dict[key] || 0) + 1;

      return { ...dict, [key]: value };
    }, {} as Obj);

  const computeSteps = (steps: number) => {
    while (steps--) {
      dictionaryFreq = Object.entries(dictionaryFreq).reduce(
        (newDictionary, [key, val]) => {
          const key1 = key[0] + rules[key];
          const key2 = rules[key] + key[1];
          const val1 = (newDictionary[key1] || 0) + val;
          const val2 = (newDictionary[key2] || 0) + val;

          return { ...newDictionary, [key1]: val1, [key2]: val2 };
        },
        {} as Obj
      );
    }

    const elementsFreq = Object.entries(dictionaryFreq).reduce(
      (freq, [dictKey, dictVal]) => {
        const key = dictKey[0];
        const val = (freq[key] || 0) + dictVal;

        return { ...freq, [key]: val };
      },
      {} as Obj
    );

    const mostCommonElement = Math.max(...Object.values(elementsFreq));
    const leastCommonElement = Math.min(...Object.values(elementsFreq));

    return mostCommonElement - leastCommonElement + 1;
  };

  const PART_ONE_STEPS = 10;
  const PART_TWO_STEPS = 40;

  const star1 = computeSteps(PART_ONE_STEPS);
  // already done 10 steps
  const star2 = computeSteps(PART_TWO_STEPS - PART_ONE_STEPS);

  showTheResult({ star1, star2, path: __filename });
};

day14();
