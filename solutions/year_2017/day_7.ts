import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getStar1 = (input: string[]) => {
  const bases = new Set<string>();
  const keys = new Set<string>();
  const rows = input.filter((line) => line.includes(' -> '));

  for (const row of rows) {
    const [key, towers] = row.split(' -> ');
    keys.add(key.split(' ')[0]);

    for (const tower of towers.split(', ')) {
      bases.add(tower);
    }
  }

  for (const key of keys) {
    if (!bases.has(key)) return key;
  }

  throw new Error('No base found');
};

const calculateTotalWeight = (
  name: string,
  weightsMap: Record<string, { weight: number; towers: string[] }>,
): number => {
  const { weight, towers } = weightsMap[name];
  return (
    weight +
    towers.reduce<number>(
      (acc, tower) => acc + calculateTotalWeight(tower, weightsMap),
      0,
    )
  );
};

const getBases = (
  key: string,
  weightsMap: {
    [key: string]: {
      weight: number;
      towers: string[];
    };
  },
): { [key: string]: number } => {
  const bases = weightsMap[key].towers;
  const tempBasesMap: { [key: string]: number } = {};

  for (const base of bases) {
    tempBasesMap[base] = calculateTotalWeight(base, weightsMap);
  }

  const sortedBases = Object.entries(tempBasesMap).sort((a, b) => b[1] - a[1]);

  if (new Set(sortedBases.map(([, weight]) => weight)).size > 1) {
    const heavierBaseKey = sortedBases[0][0];
    const subBasesMap = getBases(heavierBaseKey, weightsMap);

    if (
      Object.values(subBasesMap).every(
        (weight) => weight === Object.values(subBasesMap)[0],
      )
    ) {
      return tempBasesMap;
    }

    return subBasesMap;
  }

  return tempBasesMap;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const star1 = getStar1(input);

  const weightsMap: { [key: string]: { weight: number; towers: string[] } } =
    {};

  for (const row of input) {
    const [keyWeight, towers] = row.split(' -> ');
    const [key, weight] = keyWeight.split(' ');

    weightsMap[key] = {
      weight: extractNumbers(weight)[0],
      towers: towers ? towers.split(', ') : [],
    };
  }

  const basesMap = getBases(star1, weightsMap);

  const sortedBases = Object.entries(basesMap).sort((a, b) => b[1] - a[1]);
  const diff = sortedBases[0][1] - sortedBases[1][1];
  const star2 = weightsMap[sortedBases[0][0]].weight - diff;

  showTheResult({
    star1,
    star2,
    path: __filename,
  });
  console.timeEnd('time');
})();
