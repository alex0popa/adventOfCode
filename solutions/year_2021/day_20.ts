import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const day20 = async () => {
  const input = (await getInputForDay(__filename)).split('\n\n');
  const imageEnhancementAlgorithm = input[0];
  let inputImage = input[1].split('\n');

  // initial input image
  inputImage = inputImage.map((l) => `..${l}..`);
  let whiteLine = Array(inputImage[0].length).fill('.').join('');
  inputImage = [whiteLine, whiteLine, ...inputImage, whiteLine, whiteLine];

  const computeInput = (index: number) => {
    const char =
      index % 2
        ? imageEnhancementAlgorithm[0]
        : imageEnhancementAlgorithm.slice(-1);

    inputImage = inputImage.map(
      (line) => `${char}${char}${line}${char}${char}`
    );
    whiteLine = Array(inputImage[0].length).fill(char).join('');
    inputImage = [whiteLine, whiteLine, ...inputImage, whiteLine, whiteLine];
  };

  const getStar = () =>
    inputImage
      .join('')
      .split('')
      .reduce((a, c) => (c === '#' ? ++a : a), 0);

  let star1 = 0;

  for (let enhance = 1; enhance <= 50; ++enhance) {
    let map: string[] = [];

    for (let i = 0; i < inputImage.length - 2; ++i) {
      let line = '';

      for (let j = 0; j < inputImage[i].length - 2; ++j) {
        const p1 = inputImage[i].slice(j, j + 3);
        const p2 = inputImage[i + 1].slice(j, j + 3);
        const p3 = inputImage[i + 2].slice(j, j + 3);

        const binary = `${p1}${p2}${p3}`
          .split('')
          .reduce((a, c) => a + (c === '.' ? '0' : '1'), '');

        const decimal = parseInt(binary, 2);

        line += imageEnhancementAlgorithm[decimal];
      }

      map.push(line);
    }

    inputImage = map;

    enhance === 2 && (star1 = getStar());

    computeInput(enhance);
  }

  const star2 = getStar();

  showTheResult({ star1, star2, path: __filename });
};

day20();
