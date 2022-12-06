import { getAlphabet } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const LETTERS = [...getAlphabet('a'), ...getAlphabet('A')];

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const { star1, star2 } = input.reduce(
    ({ star1, star2 }, line, idx) => {
      const firstCompartment = line.slice(0, line.length / 2);
      const secondCompartment = line.slice(line.length / 2);

      for (let i = 0; i < firstCompartment.length; ++i) {
        if (secondCompartment.includes(firstCompartment[i])) {
          star1 += LETTERS.findIndex((s) => s === firstCompartment[i]) + 1;
          break;
        }
      }

      if (idx % 3 === 0) {
        const line2 = input[idx + 1];
        const line3 = input[idx + 2];

        for (let i = 0; i < line.length; ++i) {
          if (line2.includes(line[i]) && line3.includes(line[i])) {
            star2 += LETTERS.findIndex((s) => s === line[i]) + 1;
            break;
          }
        }
      }

      return { star1, star2 };
    },
    { star1: 0, star2: 0 }
  );

  showTheResult({ star1, star2, path: __filename });
})();
