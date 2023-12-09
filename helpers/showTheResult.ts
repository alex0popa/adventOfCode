type Stars = { star1: number | string; star2: number | string; path: string };

const displayResult = ({ star1, star2, path }: Stars, i?: number) => {
  const day = +path.split('day_')[1].replace('.ts', '');
  const maxLenght = Math.max(`${star1}`.length, `${star2}`.length);

  const titleEnd = maxLenght + (day > 9 ? 1 : 2);

  const s1 = maxLenght - `${star1}`.length;
  const s2 = maxLenght - `${star2}`.length;

  return `
     ${[...Array(maxLenght + 13).fill('-')].join('')}
    |      day_${day}${[...Array(titleEnd).fill(' ')].join('')}|
    |${[...Array(maxLenght + 13).fill(' ')].join('')}|
    |  star1 => ${star1}${[...Array(s1).fill(' ')].join('')}  |
    |  star2 => ${star2}${[...Array(s2).fill(' ')].join('')}  |
     ${[...Array(maxLenght + 13).fill('-')].join('')}
    `;
};

export const showTheResult = (res: Stars) => {
  console.log(`\x1b[1;94m%s\x1b[0m`, displayResult(res));
  console.timeEnd('time');
};
