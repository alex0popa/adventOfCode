import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type TargetNumber = { value: number, index: number };

const DIGITS_AS_LETTERS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
];

const extractTargetNumbersByPattern = ({
  pattern,
  string,
  getValue
}: {
  pattern: string | RegExp,
  string: string,
  getValue(param: string): number
}) => {
  const regexPattern = new RegExp(pattern, 'gi');
  const matches = string.matchAll(regexPattern);
  const numbers: TargetNumber[] = []

  for (const match of matches) {
    numbers.push({
      value: getValue(match[0]),
      index: match.index ?? -1
    
    })
  }

  return numbers;
}

const getFirstAndLastFromArray = (array: TargetNumber[]): [TargetNumber, TargetNumber] => {
  const first = array[0] ?? { index: -1, value: 0 }
  const last = array.slice(-1)[0] ?? { index: -1, value: 0 };

  return [first, last];
}

const getStar1TargetNumbers = (string: string) => {
  const targetNumbers = extractTargetNumbersByPattern({
    pattern: /-?\d/,
    string,
    getValue: Number
  });
  
  return getFirstAndLastFromArray(targetNumbers);
}

const getStar2TargetNumbers = (string: string, star1Numbers: TargetNumber[]) => {
  const stringNumbers = DIGITS_AS_LETTERS.reduce<TargetNumber[]>((arr, pattern) => {
    const targetNumbers = extractTargetNumbersByPattern({
      pattern,
      string,
      getValue: (digit) => DIGITS_AS_LETTERS.indexOf(digit) + 1
    });

    return [...arr, ...targetNumbers];
  }, []);

  const star2Numbers = [...star1Numbers, ...stringNumbers]
    .filter(({ index }) => index > -1)
    .sort((a, b) => a.index - b.index);

  return getFirstAndLastFromArray(star2Numbers);
}

(async () =>  {
  const { star1, star2 } = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .reduce(({ star1, star2 }, string) => {
      const star1Numbers = getStar1TargetNumbers(string);
      const targetStar1 = (star1Numbers[0].value * 10 + star1Numbers[1].value)

      star1 += targetStar1;

      const star2Numbers = getStar2TargetNumbers(string, star1Numbers);
      const targetStar2 = (star2Numbers[0].value * 10 + star2Numbers[1].value);

      star2 += targetStar2;

      return { star1, star2 }
    }, { star1: 0, star2: 0 });

  showTheResult({ star1, star2, path: __filename });
})();
