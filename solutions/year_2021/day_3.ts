import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type GE = { gama: string; epsilon: string };

(async () => {
  const input = (await getInputForDay(__filename)).split('\n');

  const extractGamaEpsilon = ({ gama, epsilon }: GE, c: number) => ({
    gama: gama + (c > input.length / 2 ? '1' : '0'),
    epsilon: epsilon + (c > input.length / 2 ? '0' : '1'),
  });

  const getFreq = (freqArr: number[], line: string) => {
    line.split('').forEach((c, i) => +c && ++freqArr[i]);

    return freqArr;
  };

  const { gama, epsilon }: GE = input
    .reduce(getFreq, Array(input[0].length).fill(0))
    .reduce(extractGamaEpsilon, { gama: '', epsilon: '' });

  const getGas = (arr: string[], gas: 'O' | 'CO2', i = 0): number => {
    const ones = arr.reduce((a, c) => (+c[i] ? ++a : a), 0);

    const type = {
      O: ones >= arr.length / 2 ? '1' : '0',
      CO2: ones >= arr.length / 2 ? '0' : '1',
    };

    arr = arr.filter((el) => el[i] === type[gas]);

    return arr.length < 2 ? parseInt(arr[0], 2) : getGas(arr, gas, ++i);
  };

  const star1 = parseInt(gama, 2) * parseInt(epsilon, 2);
  const star2 = getGas(input, 'O') * getGas(input, 'CO2');

  showTheResult({ star1, star2, path: __filename });
})();
