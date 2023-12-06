
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import {extractNumbers} from '../../helpers/general';

type Card = {
  myNumbers: number[];
  winingNumbers: number[]
};

const getPoints = (matchedNumbers: number) => {
  return matchedNumbers < 3 ? matchedNumbers : Math.pow(2, matchedNumbers - 1);
}

const getMatchedNumbers = ({ myNumbers, winingNumbers }: Card) => {
  return myNumbers.reduce(
    (total, myNumber) => winingNumbers.includes(myNumber) ? total + 1: total,
    0
  );
}

const extractDataStructure = (input: string[]) => {
  return input.reduce<{ copies: number; matchedNumbers: number }[]>(
    (cards, line) => {
      const [winingNumbers, myNumbers] = line
        .split(': ')[1]
        .split(' | ')
        .map(extractNumbers);

      return [
        ...cards,
        {
          copies: 1,
          matchedNumbers: getMatchedNumbers({ winingNumbers, myNumbers })
        }
      ];
    },
    []
  );
};

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const cards = extractDataStructure(input);

  const { star1, star2} = cards.reduce(
    ({ star1, star2 }, { copies, matchedNumbers }, idx) => {
      star1 += getPoints(matchedNumbers);

      for (let i = 1; i <= matchedNumbers; ++i) cards[idx + i].copies += copies;
      
      star2 += copies;

      return { star1, star2 }
    },
    { star1: 0, star2: 0 }
  );

  showTheResult({ star1, star2, path: __filename });
})();
