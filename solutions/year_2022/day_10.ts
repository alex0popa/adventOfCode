import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const MAX_ROW_LENGTH = 40;

const getStar1 = (input: string[], register = 1) => {
  let sumOfSignalStrengths = 0;

  for (let i = 0, cycles = 1; i < input.length; ++i, ++cycles) {
    let targetIsReached = cycles % 40 === 20; // 20 60 100 140 180 220

    const [, V] = input[i].split(' ').map(Number);
    const isTwoCyclesCase = !isNaN(V);

    if (isTwoCyclesCase) {
      if (targetIsReached) {
        // reuse the input on next cycle
        --i;
      } else {
        // check if target is reached
        targetIsReached = ++cycles % 40 === 20;

        // update register
        register += V;
      }
    }

    // update sum
    targetIsReached && (sumOfSignalStrengths += register * cycles);
  }

  return sumOfSignalStrengths;
};

const getStar2 = (input: string[], row = '', register = 1) => {
  const getPixel = () => (Math.abs(register - row.length) < 2 ? '#' : ' ');

  const handleRow = (isTwoCyclesCase = false) => {
    row += getPixel();

    if (row.length === MAX_ROW_LENGTH) {
      console.log(row);
      row = '';
    }

    isTwoCyclesCase && handleRow();

    return isTwoCyclesCase;
  };

  input.forEach((line) => {
    const [, V] = line.split(' ').map(Number);
    const isTwoCyclesCase = !isNaN(V);

    handleRow(isTwoCyclesCase) && (register += V);
  });
};

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const star1 = getStar1(input);
  getStar2(input);

  showTheResult({
    star1,
    star2: 'FPGPHFGH',
    path: __filename,
  });
})();
