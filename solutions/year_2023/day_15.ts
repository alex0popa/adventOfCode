import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const hash = (string: string, currentValue = 0) => {
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256
  }

  return currentValue;
}

const getInfo = (string: string) => {
  const operation = string.includes('-') ? '-' : '=';
  const [label, focal  = ''] = string.split(operation);
  const box = hash(label);

  return [operation, box, label, Number(focal)] as const;
}

const getStar2 = (input: string[]) => {
  const boxes = [...Array(256)].map<[string, number][]>(() => []);

  for (const string of input) {
    const [operation, boxIdx, label, focal] = getInfo(string);

    if(operation === '-') {
      boxes[boxIdx] = boxes[boxIdx].filter(([key]) => key !== label);
    } else if(operation === '=') {
      let existingLensIdx = boxes[boxIdx].findIndex(([key]) => key === label);

      if(existingLensIdx === -1) existingLensIdx = boxes[boxIdx].length;
      
      boxes[boxIdx][existingLensIdx] = [label, focal];
    }
  }

  let star2 = 0;

  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      const [, focal] = boxes[i][j];
      const focusingPower = (i + 1) * (j + 1) * focal;

      star2 += focusingPower
    }
  }

  return star2;
}

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')[0]
    .split(',');

  const star1 = input.reduce((sum, string) => sum + hash(string), 0);
  const star2 = getStar2(input);
  

  showTheResult({ star1, star2, path: __filename });
})();